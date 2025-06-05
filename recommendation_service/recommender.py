import numpy as np
import pickle
import os
from pymongo import MongoClient
from lightfm import LightFM
from scipy.sparse import coo_matrix, hstack
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
# Không cần import load_npz ở đây nếu tất cả các file đều được lưu và tải bằng pickle

class Recommender:
    def __init__(self, model_dir='models', mongo_uri='mongodb://localhost:27017/', db_name='BTL_TMDT'):
        self.model = None
        self.user_id_map = {}
        self.item_id_map = {}
        self.reverse_item_id_map = {}
        self.item_features_matrix = None
        self.tfidf_vectorizer = None
        self.category_features_header = []
        self.nsx_features_header = []

        # Định nghĩa tất cả các đường dẫn file .pkl
        self.model_path = os.path.join(model_dir, 'lightfm_model.pkl')
        self.user_id_map_path = os.path.join(model_dir, 'user_id_map.pkl')
        self.item_id_map_path = os.path.join(model_dir, 'item_id_map.pkl')
        self.reverse_item_id_map_path = os.path.join(model_dir, 'reverse_item_id_map.pkl')
        self.item_features_path = os.path.join(model_dir, 'item_features_matrix.pkl') # Đảm bảo là .pkl
        self.tfidf_vectorizer_path = os.path.join(model_dir, 'tfidf_vectorizer.pkl')
        self.category_features_header_path = os.path.join(model_dir, 'category_features_header.pkl')
        self.nsx_features_header_path = os.path.join(model_dir, 'nsx_features_header.pkl')

        self.mongo_client = MongoClient(mongo_uri)
        self.db = self.mongo_client[db_name]

    def _load_single_pickle_asset(self, path, asset_name):
        """Hàm trợ giúp để tải một file pickle duy nhất."""
        try:
            with open(path, 'rb') as f:
                asset = pickle.load(f)
            print(f"'{asset_name}' đã được tải từ: {path}")
            return asset
        except FileNotFoundError:
            print(f"Lỗi: Không tìm thấy file '{asset_name}' tại: {path}.")
            return None
        except EOFError:
            print(f"Lỗi EOFError: File '{asset_name}' tại '{path}' có thể bị rỗng hoặc hỏng.")
            return None
        except Exception as e:
            print(f"Lỗi khi tải '{asset_name}' từ '{path}': {e}")
            return None

    def load_assets(self):
        """Tải tất cả các tài nguyên cần thiết cho gợi ý."""
        print("Bắt đầu tải các tài nguyên gợi ý...")

        self.model = self._load_single_pickle_asset(self.model_path, "mô hình LightFM")
        if self.model is None: return False

        self.user_id_map = self._load_single_pickle_asset(self.user_id_map_path, "ánh xạ user ID")
        if self.user_id_map is None: return False

        self.item_id_map = self._load_single_pickle_asset(self.item_id_map_path, "ánh xạ item ID")
        if self.item_id_map is None: return False

        self.reverse_item_id_map = self._load_single_pickle_asset(self.reverse_item_id_map_path, "ánh xạ ngược item ID")
        if self.reverse_item_id_map is None: return False

        # Tải item_features_matrix - Đảm bảo app.py lưu nó dưới dạng .pkl
        self.item_features_matrix = self._load_single_pickle_asset(self.item_features_path, "ma trận đặc trưng sản phẩm")
        if self.item_features_matrix is None: return False

        self.tfidf_vectorizer = self._load_single_pickle_asset(self.tfidf_vectorizer_path, "TF-IDF vectorizer")
        if self.tfidf_vectorizer is None: return False

        self.category_features_header = self._load_single_pickle_asset(self.category_features_header_path, "header đặc trưng danh mục")
        if self.category_features_header is None: return False

        self.nsx_features_header = self._load_single_pickle_asset(self.nsx_features_header_path, "header đặc trưng nhà sản xuất")
        if self.nsx_features_header is None: return False

        print("Tất cả tài nguyên gợi ý đã được tải hoàn chỉnh.")
        return True

    def _generate_item_features_for_new_product(self, product_data):
        """
        Tạo ma trận đặc trưng cho một sản phẩm mới hoặc sản phẩm chưa có trong ma trận item_features_matrix.
        Sử dụng cùng TF-IDF Vectorizer và ánh xạ One-Hot Encoding đã dùng khi huấn luyện.
        """
        if not self.tfidf_vectorizer or not self.category_features_header or not self.nsx_features_header:
            raise RuntimeError("Vectorizer hoặc headers chưa được tải. Vui lòng tải tài nguyên trước khi tạo đặc trưng.")

        # Text features
        text_features_combined = product_data.get('prodName', '') + " " + product_data.get('prodDescription', '')
        text_features_matrix = self.tfidf_vectorizer.transform([text_features_combined])

        # Category One-Hot
        category_name = product_data.get('category', {}).get('categoryName', 'Unknown')
        category_one_hot = np.zeros(len(self.category_features_header))
        if f'category_{category_name}' in self.category_features_header:
            idx = self.category_features_header.index(f'category_{category_name}')
            category_one_hot[idx] = 1
        category_features_matrix = coo_matrix(category_one_hot.reshape(1, -1))

        # NSX One-Hot
        nsx_name = product_data.get('prodNsx', 'Unknown')
        nsx_one_hot = np.zeros(len(self.nsx_features_header))
        if f'nsx_{nsx_name}' in self.nsx_features_header:
            idx = self.nsx_features_header.index(f'nsx_{nsx_name}')
            nsx_one_hot[idx] = 1
        nsx_features_matrix = coo_matrix(nsx_one_hot.reshape(1, -1))

        return hstack([text_features_matrix, category_features_matrix, nsx_features_matrix]).tocsr()

    def get_recommendations(self, user_id, num_recommendations=10):
        """
        Tạo gợi ý sản phẩm cho một người dùng.
        """
        if not self.model or self.item_features_matrix is None:
            print("Mô hình hoặc ma trận đặc trưng chưa được tải. Không thể tạo gợi ý.")
            return self.get_popular_products(num_recommendations=num_recommendations)

        if user_id not in self.user_id_map:
            print(f"Người dùng '{user_id}' là người dùng mới hoặc không có trong dữ liệu huấn luyện. Trả về sản phẩm phổ biến.")
            return self.get_popular_products(num_recommendations=num_recommendations)

        user_internal_id = self.user_id_map[user_id]

        # Lấy danh sách các sản phẩm mà người dùng đã tương tác
        interacted_product_cursor = self.db.interaction_logs.find(
            {"userId": user_id, "interactionType": {"$in": ["PURCHASE", "ADD_TO_CART", "REVIEW"]}},
            {"productId": 1}
        )
        interacted_product_ids = {item['productId'] for item in list(interacted_product_cursor)}
        print(f"Người dùng {user_id} đã tương tác với {len(interacted_product_ids)} sản phẩm.")

        all_item_indices = np.arange(self.item_features_matrix.shape[0])

        # Dự đoán điểm cho tất cả các sản phẩm
        scores = self.model.predict(user_internal_id, all_item_indices, item_features=self.item_features_matrix)

        # Sắp xếp sản phẩm theo điểm dự đoán giảm dần
        top_item_indices = np.argsort(-scores)

        recommended_product_ids = []
        for item_idx in top_item_indices:
            original_prod_id = self.reverse_item_id_map.get(item_idx)
            if original_prod_id and original_prod_id not in interacted_product_ids:
                recommended_product_ids.append(original_prod_id)
            if len(recommended_product_ids) >= num_recommendations:
                break

        # Lấy thông tin chi tiết sản phẩm từ MongoDB
        if not recommended_product_ids:
            return [] # Không có sản phẩm nào được gợi ý sau khi loại bỏ đã tương tác

        recommended_products_details_cursor = self.db.products.find(
            {"_id": {"$in": recommended_product_ids}}
        )
        recommended_products_details = list(recommended_products_details_cursor)

        # Sắp xếp lại theo thứ tự gợi ý từ LightFM
        # Sử dụng dictionary để tra cứu nhanh hơn, tránh lỗi nếu _id không có trong recommended_product_ids
        prod_details_map = {str(p.get('_id')): p for p in recommended_products_details}
        final_recommendations = [prod_details_map[str(pid)] for pid in recommended_product_ids if str(pid) in prod_details_map]

        return final_recommendations

    def get_popular_products(self, num_recommendations=10):
        """
        Fallback: Trả về các sản phẩm phổ biến nhất (dựa trên lượt mua hoặc xem).
        """
        print("Đang lấy sản phẩm phổ biến nhất (fallback).")
        
        # Ưu tiên sản phẩm được mua nhiều nhất
        popular_products_cursor = self.db.interaction_logs.aggregate([
            {"$match": {"interactionType": "PURCHASE"}},
            {"$group": {"_id": "$productId", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": num_recommendations}
        ])
        popular_product_ids = [item['_id'] for item in list(popular_products_cursor)]

        if not popular_product_ids: # Nếu không có lượt mua, lấy sản phẩm xem nhiều nhất
            popular_products_cursor = self.db.interaction_logs.aggregate([
                {"$match": {"interactionType": "VIEW"}},
                {"$group": {"_id": "$productId", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": num_recommendations}
            ])
            popular_product_ids = [item['_id'] for item in list(popular_products_cursor)]

        if not popular_product_ids:
            print("Không có sản phẩm phổ biến nào được tìm thấy.")
            return []

        recommended_products = list(self.db.products.find({"_id": {"$in": popular_product_ids}}))

        # Sắp xếp lại theo thứ tự phổ biến
        prod_map = {str(p.get('_id')): p for p in recommended_products}
        final_popular_products = [prod_map[str(pid)] for pid in popular_product_ids if str(pid) in prod_map]
        
        return final_popular_products

    def get_similar_items(self, prod_id, num_similar=5):
        """
        Tìm kiếm các sản phẩm tương tự dựa trên đặc trưng sản phẩm.
        """
        if not self.model or self.item_features_matrix is None or not self.item_id_map or not self.reverse_item_id_map:
            print("Tài nguyên chưa được tải đầy đủ. Không thể tìm sản phẩm tương tự.")
            return []

        if prod_id not in self.item_id_map:
            # Xử lý sản phẩm mới (cold start item)
            product_data = self.db.products.find_one({"_id": prod_id})
            if not product_data:
                print(f"Sản phẩm '{prod_id}' không tồn tại trong DB.")
                return []
            
            try:
                # Nếu sản phẩm mới, ta sẽ không thể sử dụng LightFM để lấy embeddings trực tiếp
                # Thay vào đó, có thể tính toán độ tương đồng dựa trên 'new_item_features'
                # với item_features_matrix của các sản phẩm đã biết.
                # Đây là một phần phức tạp hơn và thường yêu cầu tính toán khoảng cách/tương đồng
                # trực tiếp trên ma trận đặc trưng, hoặc sử dụng embeddings từ một mô hình khác.
                # Hiện tại, hàm này đang là placeholder.
                print(f"Sản phẩm mới '{prod_id}'. Chức năng tìm sản phẩm tương tự cho cold-start item chưa được triển khai chi tiết.")
                return []
            except RuntimeError as e:
                print(f"Lỗi tạo đặc trưng cho sản phẩm mới: {e}")
                return []

        item_internal_id = self.item_id_map[prod_id]

        # LightFM có thể cung cấp item embeddings (item_biases + item_vectors).
        # Cách tốt nhất để tìm sản phẩm tương tự là sử dụng cosine similarity
        # giữa các vector biểu diễn sản phẩm (latent factors) từ mô hình LightFM.
        # Hoặc tính toán trực tiếp trên item_features_matrix nếu đặc trưng đủ biểu cảm.

        # Lấy item_embeddings (latent factors) từ mô hình LightFM
        # LightFM get_item_representations trả về (item_biases, item_latent_factors)
        # Chúng ta thường dùng item_latent_factors cho tính toán tương đồng.
        # Dùng item_features=self.item_features_matrix nếu bạn muốn embeddings có tính đến features.
        item_biases, item_embeddings = self.model.get_item_representations(features=self.item_features_matrix)
        
        target_embedding = item_embeddings[item_internal_id]

        # Tính toán cosine similarity
        # Sử dụng sklearn.metrics.pairwise.cosine_similarity nếu bạn có nó.
        # from sklearn.metrics.pairwise import cosine_similarity
        
        # Nếu không muốn import thêm sklearn.metrics.pairwise, có thể tính thủ công:
        
        # Chuẩn hóa vector embeddings
        norm_embeddings = np.linalg.norm(item_embeddings, axis=1)
        # Tránh chia cho 0
        norm_embeddings[norm_embeddings == 0] = 1e-10 
        normalized_item_embeddings = item_embeddings / norm_embeddings[:, np.newaxis]

        norm_target_embedding = np.linalg.norm(target_embedding)
        if norm_target_embedding == 0: norm_target_embedding = 1e-10
        normalized_target_embedding = target_embedding / norm_target_embedding

        # Tính dot product (tương đương cosine similarity khi đã chuẩn hóa)
        similarities = normalized_item_embeddings.dot(normalized_target_embedding)

        # Sắp xếp và lấy các sản phẩm tương tự nhất
        # Loại bỏ chính sản phẩm đó khỏi kết quả (thường là sản phẩm có điểm tương đồng cao nhất = 1)
        top_similar_indices = np.argsort(-similarities)
        similar_prod_ids = []
        for idx in top_similar_indices:
            if idx == item_internal_id: # Bỏ qua chính sản phẩm đó
                continue
            original_prod_id = self.reverse_item_id_map.get(idx)
            if original_prod_id:
                similar_prod_ids.append(original_prod_id)
            if len(similar_prod_ids) >= num_similar:
                break
        
        if not similar_prod_ids:
            return []

        # Lấy thông tin chi tiết sản phẩm từ MongoDB
        similar_products_details_cursor = self.db.products.find(
            {"_id": {"$in": similar_prod_ids}}
        )
        similar_products_details = list(similar_products_details_cursor)

        # Sắp xếp lại theo thứ tự tương đồng
        prod_details_map = {str(p.get('_id')): p for p in similar_products_details}
        final_similar_items = [prod_details_map[str(pid)] for pid in similar_prod_ids if str(pid) in prod_details_map]

        print(f"Đã tìm thấy {len(final_similar_items)} sản phẩm tương tự cho '{prod_id}'.")
        return final_similar_items


# Example usage (for testing)
if __name__ == "__main__":
    recommender = Recommender()
    if recommender.load_assets():
        # Test với một user ID (thay thế bằng ID thực từ DB của bạn)
        test_user_id = "65241f71587d656cfc6e94e4" # Thay thế bằng ID người dùng có trong DB của bạn
        recommendations = recommender.get_recommendations(test_user_id)

        if recommendations:
            print(f"\nSản phẩm gợi ý cho người dùng {test_user_id}:")
            for prod in recommendations:
                print(f"- {prod.get('prodName')} (ID: {prod.get('_id')}, Giá: {prod.get('prodPrice')})")
        else:
            print(f"\nKhông có gợi ý cho người dùng {test_user_id}.")

        # Test user mới (cold start)
        cold_start_user_id = "non_existent_user_123"
        cold_start_recommendations = recommender.get_recommendations(cold_start_user_id)
        if cold_start_recommendations:
            print(f"\nSản phẩm gợi ý cho người dùng Cold Start '{cold_start_user_id}':")
            for prod in cold_start_recommendations:
                print(f"- {prod.get('prodName')} (ID: {prod.get('_id')}, Giá: {prod.get('prodPrice')})")
        else:
            print(f"\nKhông có gợi ý cho người dùng cold start '{cold_start_user_id}'.")

        # Test tìm sản phẩm tương tự (thay thế bằng ID sản phẩm thực từ DB của bạn)
        # Đảm bảo bạn có ít nhất một sản phẩm trong item_id_map sau khi huấn luyện.
        if recommender.item_id_map:
            some_prod_id = next(iter(recommender.item_id_map)) # Lấy một ID sản phẩm bất kỳ từ map
            similar_items = recommender.get_similar_items(some_prod_id, num_similar=3)
            if similar_items:
                print(f"\nSản phẩm tương tự cho '{some_prod_id}':")
                for prod in similar_items:
                    print(f"- {prod.get('prodName')} (ID: {prod.get('_id')}, Giá: {prod.get('prodPrice')})")
            else:
                print(f"\nKhông tìm thấy sản phẩm tương tự cho '{some_prod_id}'.")
        else:
            print("\nKhông có sản phẩm trong item_id_map để kiểm tra tìm sản phẩm tương tự.")