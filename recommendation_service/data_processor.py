import pandas as pd
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import coo_matrix, hstack
import numpy as np
import pickle
import os

class DataProcessor:
    def __init__(self, mongo_uri='mongodb://localhost:27017/', db_name='BTL_TMDT'):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.user_id_map = {}
        self.item_id_map = {}
        self.reverse_item_id_map = {}
        self.tfidf_vectorizer = None
        self.category_features_header = []
        self.nsx_features_header = []

    def load_data(self):
        """Tải dữ liệu tương tác và sản phẩm từ MongoDB."""
        interactions_cursor = self.db.interaction_logs.find({})
        products_cursor = self.db.products.find({})

        interactions_df = pd.DataFrame(list(interactions_cursor))
        products_df = pd.DataFrame(list(products_cursor))

        if products_df.empty:
            raise ValueError("Không tìm thấy dữ liệu sản phẩm trong MongoDB.")

        # CHỈNH SỬA TẠI ĐÂY: Chuẩn hóa kiểu dữ liệu của _id và productId sang chuỗi (str)
        # Đối với products_df: _id thường là ObjectId, cần chuyển đổi
        products_df.rename(columns={'_id': 'prodId'}, inplace=True)
        products_df['prodId'] = products_df['prodId'].astype(str)

        # Đối với interactions_df: userId và productId cần được đảm bảo là chuỗi
        # Nếu userId và productId trong MongoDB đã là chuỗi thì không cần .astype(str)
        # nhưng làm vậy để đảm bảo an toàn nếu có sự không nhất quán.
        if 'userId' in interactions_df.columns:
            interactions_df['userId'] = interactions_df['userId'].astype(str)
        if 'productId' in interactions_df.columns:
            interactions_df['productId'] = interactions_df['productId'].astype(str)


        return interactions_df, products_df

    def preprocess(self, interactions_df, products_df):
        """
        Tiền xử lý dữ liệu để tạo ma trận tương tác và ma trận đặc trưng sản phẩm.
        """
        # --- 1. Ánh xạ ID ---
        # Sau khi chuẩn hóa kiểu dữ liệu ở load_data, phần này sẽ hoạt động chính xác
        unique_users = interactions_df['userId'].unique() if not interactions_df.empty else []
        unique_items = products_df['prodId'].unique()

        self.user_id_map = {original_id: idx for idx, original_id in enumerate(unique_users)}
        self.item_id_map = {original_id: idx for idx, original_id in enumerate(unique_items)}
        self.reverse_item_id_map = {idx: original_id for original_id, idx in self.item_id_map.items()}

        # --- 2. Xây dựng Ma trận Tương tác (Interactions Matrix) ---
        # Lọc interactions_df để chỉ chứa các userId và productId đã được ánh xạ
        interactions_df_mapped = interactions_df[
            interactions_df['userId'].isin(self.user_id_map.keys()) &
            interactions_df['productId'].isin(self.item_id_map.keys())
        ].copy() # Sử dụng .copy() để tránh SettingWithCopyWarning

        if interactions_df_mapped.empty:
            # Handle case where no valid interactions are found after mapping
            print("Không có tương tác hợp lệ sau khi ánh xạ ID. Trả về ma trận tương tác rỗng.")
            interactions_matrix = coo_matrix((0, 0), shape=(len(self.user_id_map), len(self.item_id_map)))
        else:
            interactions_df_mapped['user_idx'] = interactions_df_mapped['userId'].map(self.user_id_map)
            interactions_df_mapped['item_idx'] = interactions_df_mapped['productId'].map(self.item_id_map)

            # Gán trọng số cho các loại tương tác
            def get_interaction_weight(row):
                if row['interactionType'] == 'PURCHASE':
                    return 5.0
                elif row['interactionType'] == 'ADD_TO_CART':
                    return 3.0
                elif row['interactionType'] == 'REVIEW' and row.get('rating') is not None:
                    try:
                        return float(row['rating']) # Sử dụng rating trực tiếp
                    except ValueError:
                        return 1.0 # Default if rating is not valid number
                elif row['interactionType'] == 'VIEW':
                    return 1.0
                return 0.0

            interactions_df_mapped['interaction_weight'] = interactions_df_mapped.apply(get_interaction_weight, axis=1)

            # Aggregate multiple interactions per user-item pair
            # Use max to get the highest interaction weight for a pair
            agg_interactions = interactions_df_mapped.groupby(['user_idx', 'item_idx'])['interaction_weight'].max().reset_index()

            interactions_matrix = coo_matrix(
                (agg_interactions['interaction_weight'],
                 (agg_interactions['user_idx'], agg_interactions['item_idx'])),
                shape=(len(self.user_id_map), len(self.item_id_map))
            )

        # --- 3. Xây dựng Ma trận Đặc trưng Sản phẩm (Item Features Matrix) ---
        # Sắp xếp products_df theo thứ tự của item_id_map để đảm bảo khớp với ma trận
        products_df = products_df[products_df['prodId'].isin(self.item_id_map.keys())].copy()
        products_df['item_idx'] = products_df['prodId'].map(self.item_id_map)
        products_df = products_df.sort_values('item_idx').reset_index(drop=True)

        # TF-IDF cho tên và mô tả sản phẩm
        products_df['text_features_combined'] = products_df['prodName'].fillna('') + " " + products_df['prodDescription'].fillna('')
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=2000) # Giới hạn số lượng features
        text_features_matrix = self.tfidf_vectorizer.fit_transform(products_df['text_features_combined'])

        # One-Hot Encoding cho Category và Nsx
        # Đảm bảo xử lý các giá trị null và lấy categoryName từ đối tượng nhúng
        categories_data = products_df['category'].apply(lambda x: x.get('categoryName') if isinstance(x, dict) else None).fillna('Unknown')
        nsx_data = products_df['prodNsx'].fillna('Unknown')

        # Lấy danh sách duy nhất của category và nsx từ toàn bộ dataset
        unique_categories = sorted(categories_data.unique())
        unique_nsx = sorted(nsx_data.unique())

        # Tạo ma trận one-hot cho category
        category_one_hot = pd.get_dummies(categories_data, prefix='category')
        self.category_features_header = list(category_one_hot.columns)

        # Tạo ma trận one-hot cho nsx
        nsx_one_hot = pd.get_dummies(nsx_data, prefix='nsx')
        self.nsx_features_header = list(nsx_one_hot.columns)

        # Chuyển đổi sang sparse matrix
        category_features_matrix = coo_matrix(category_one_hot.values)
        nsx_features_matrix = coo_matrix(nsx_one_hot.values)

        # Kết hợp tất cả các ma trận đặc trưng
        item_features_matrix = hstack([text_features_matrix, category_features_matrix, nsx_features_matrix]).tocsr()

        # Đảm bảo số lượng hàng của item_features_matrix khớp với số lượng item_idx
        if item_features_matrix.shape[0] != len(self.item_id_map):
            raise ValueError(f"Số lượng hàng của ma trận đặc trưng sản phẩm ({item_features_matrix.shape[0]}) không khớp với số lượng sản phẩm đã ánh xạ ({len(self.item_id_map)}).")


        return interactions_matrix, item_features_matrix, \
               self.user_id_map, self.item_id_map, self.reverse_item_id_map, \
               self.tfidf_vectorizer, self.category_features_header, self.nsx_features_header

    def save_assets(self, model_dir='models'):
        """Lưu trữ mappings và vectorizer."""
        os.makedirs(model_dir, exist_ok=True)
        with open(os.path.join(model_dir, 'user_id_map.pkl'), 'wb') as f:
            pickle.dump(self.user_id_map, f)
        with open(os.path.join(model_dir, 'item_id_map.pkl'), 'wb') as f:
            pickle.dump(self.item_id_map, f)
        with open(os.path.join(model_dir, 'reverse_item_id_map.pkl'), 'wb') as f:
            pickle.dump(self.reverse_item_id_map, f)
        with open(os.path.join(model_dir, 'tfidf_vectorizer.pkl'), 'wb') as f:
            pickle.dump(self.tfidf_vectorizer, f)
        with open(os.path.join(model_dir, 'category_features_header.pkl'), 'wb') as f:
            pickle.dump(self.category_features_header, f)
        with open(os.path.join(model_dir, 'nsx_features_header.pkl'), 'wb') as f:
            pickle.dump(self.nsx_features_header, f)
        print("Mappings và vectorizer đã được lưu.")

    def load_assets(self, model_dir='models'):
        """Tải mappings và vectorizer."""
        try:
            with open(os.path.join(model_dir, 'user_id_map.pkl'), 'rb') as f:
                self.user_id_map = pickle.load(f)
            with open(os.path.join(model_dir, 'item_id_map.pkl'), 'rb') as f:
                self.item_id_map = pickle.load(f)
            with open(os.path.join(model_dir, 'reverse_item_id_map.pkl'), 'rb') as f:
                self.reverse_item_id_map = pickle.load(f)
            with open(os.path.join(model_dir, 'tfidf_vectorizer.pkl'), 'rb') as f:
                self.tfidf_vectorizer = pickle.load(f)
            with open(os.path.join(model_dir, 'category_features_header.pkl'), 'rb') as f:
                self.category_features_header = pickle.load(f)
            with open(os.path.join(model_dir, 'nsx_features_header.pkl'), 'rb') as f:
                self.nsx_features_header = pickle.load(f)
            print("Mappings và vectorizer đã được tải.")
            return True
        except FileNotFoundError:
            print("Không tìm thấy file mappings hoặc vectorizer. Vui lòng huấn luyện mô hình trước.")
            return False

# Example usage (for testing)
if __name__ == "__main__":
    processor = DataProcessor()
    try:
        interactions_df, products_df = processor.load_data()
        interactions_matrix, item_features_matrix, user_map, item_map, reverse_item_map, tfidf_vec, cat_header, nsx_header = \
            processor.preprocess(interactions_df, products_df)

        print("\nInteractions Matrix Shape:", interactions_matrix.shape)
        print("Item Features Matrix Shape:", item_features_matrix.shape)
        print("Number of unique users:", len(user_map))
        print("Number of unique items:", len(item_map))

        processor.save_assets()
    except ValueError as e:
        print(f"Error during data processing: {e}")