# app.py
from flask import Flask, request, jsonify
from data_processor import DataProcessor
from model_trainer import ModelTrainer
from recommender import Recommender
import os
import pickle
# KHÔNG CẦN import save_npz, load_npz nữa vì mọi thứ sẽ được xử lý bằng pickle

app = Flask(__name__)

# Khởi tạo các đối tượng
# Đảm bảo các class DataProcessor, ModelTrainer, Recommender đã được định nghĩa đúng trong các file tương ứng
data_processor = DataProcessor()
model_trainer = ModelTrainer()
recommender = Recommender()

# Đường dẫn lưu trữ ma trận đặc trưng
# Đảm bảo đường dẫn này là .pkl để khớp với recommender.py
ITEM_FEATURES_MATRIX_PATH = os.path.join('models', 'item_features_matrix.pkl')

def initial_load():
    """
    Tải mô hình và mappings khi ứng dụng khởi động.
    Nếu không tải được, nó sẽ cảnh báo và chờ người dùng gọi /train_model.
    """
    global recommender
    print("--------------------------------------------------")
    print("Bắt đầu khởi tạo ứng dụng: Tải tài nguyên gợi ý...")
    if not recommender.load_assets():
        print("Cảnh báo: Tài nguyên gợi ý chưa sẵn sàng. Vui lòng gọi endpoint /train_model để huấn luyện và lưu mô hình.")
    else:
        print("Tất cả tài nguyên gợi ý đã được tải thành công.")
    print("--------------------------------------------------")


@app.route('/train_model', methods=['POST'])
def train_model():
    """
    Endpoint để huấn luyện lại mô hình.
    Endpoint này sẽ thực hiện toàn bộ quy trình:
    1. Tải và tiền xử lý dữ liệu.
    2. Huấn luyện mô hình LightFM.
    3. Lưu tất cả các assets cần thiết (mappings, vectorizer, item_features_matrix, model).
    """
    print("\n--- Bắt đầu quy trình huấn luyện mô hình (qua endpoint /train_model) ---")
    try:
        # 1. Tải và tiền xử lý dữ liệu
        print("1. Tải dữ liệu từ MongoDB và tiền xử lý...")
        interactions_df, products_df = data_processor.load_data()
        
        if interactions_df.empty or products_df.empty:
            print("Lỗi: Không đủ dữ liệu tương tác hoặc sản phẩm từ MongoDB.")
            return jsonify({"message": "Không đủ dữ liệu tương tác hoặc sản phẩm để huấn luyện mô hình."}), 400

        interactions_matrix, item_features_matrix, user_id_map, item_id_map, reverse_item_id_map, \
        tfidf_vectorizer, category_features_header, nsx_features_header = \
        data_processor.preprocess(interactions_df, products_df)
        
        print("Tiền xử lý dữ liệu hoàn tất.")
        print(f"  - Interactions Matrix Shape: {interactions_matrix.shape}")
        print(f"  - Item Features Matrix Shape: {item_features_matrix.shape}")
        print(f"  - Number of unique users: {len(user_id_map)}")
        print(f"  - Number of unique items: {len(item_id_map)}")

        # 2. Huấn luyện mô hình
        print("2. Bắt đầu huấn luyện mô hình LightFM...")
        # model_trainer.train() sẽ tự gọi save_model() để lưu lightfm_model.pkl
        model_trainer.train(interactions_matrix, item_features_matrix) 
        print("Huấn luyện mô hình hoàn tất.")

        # 3. Lưu trữ các assets cần thiết khác (mappings, vectorizer, item_features_matrix)
        print("3. Lưu trữ các ánh xạ, vectorizer và ma trận đặc trưng sản phẩm...")
        
        # Lưu các mappings và TF-IDF vectorizer bằng DataProcessor
        data_processor.user_id_map = user_id_map
        data_processor.item_id_map = item_id_map
        data_processor.reverse_item_id_map = reverse_item_id_map
        data_processor.tfidf_vectorizer = tfidf_vectorizer
        data_processor.category_features_header = category_features_header
        data_processor.nsx_features_header = nsx_features_header
        data_processor.save_assets() # Phương thức này sẽ lưu các file .pkl như user_id_map.pkl, item_id_map.pkl, v.v.
        print("  - Mappings và TF-IDF vectorizer đã được lưu bởi DataProcessor.")

        # LƯU TRỮ item_features_matrix RỜI RẠC VÀ CHẮC CHẮN BẰNG pickle.dump
        print(f"  - Đang lưu item features matrix tới: {ITEM_FEATURES_MATRIX_PATH}...")
        with open(ITEM_FEATURES_MATRIX_PATH, 'wb') as f:
            pickle.dump(item_features_matrix, f)
        print("  - Item features matrix đã được lưu thành công.")

        # 4. Cập nhật đối tượng recommender đang chạy với dữ liệu mới nhất
        print("4. Cập nhật đối tượng Recommender đang chạy với các tài nguyên mới...")
        recommender.model = model_trainer.model
        recommender.user_id_map = user_id_map
        recommender.item_id_map = item_id_map
        recommender.reverse_item_id_map = reverse_item_id_map
        recommender.item_features_matrix = item_features_matrix # Cập nhật ma trận
        recommender.tfidf_vectorizer = tfidf_vectorizer
        recommender.category_features_header = category_features_header
        recommender.nsx_features_header = nsx_features_header
        print("Cập nhật Recommender hoàn tất. Mô hình sẵn sàng phục vụ.")
        print("--- Quy trình huấn luyện mô hình hoàn tất thành công! ---")

        return jsonify({"message": "Mô hình đã được huấn luyện và tất cả tài nguyên đã được lưu thành công!"})

    except ValueError as e:
        print(f"Lỗi ValueError trong quá trình huấn luyện: {str(e)}")
        return jsonify({"error": f"Lỗi dữ liệu: {str(e)}"}), 400
    except Exception as e:
        print(f"Lỗi không xác định trong quá trình huấn luyện: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc() # In traceback để gỡ lỗi chi tiết hơn
        return jsonify({"error": f"Lỗi trong quá trình huấn luyện mô hình: {str(e)}"}), 500


@app.route('/recommend/<string:user_id>', methods=['GET'])
def get_recommendations(user_id):
    """
    Endpoint để lấy gợi ý sản phẩm cho một người dùng cụ thể.
    Nếu mô hình chưa sẵn sàng, nó sẽ cố gắng tải lại.
    """
    # Kiểm tra nếu mô hình hoặc ma trận đặc trưng chưa được tải, thử tải lại
    if not recommender.model or recommender.item_features_matrix is None:
        print(f"Mô hình gợi ý hoặc ma trận đặc trưng chưa sẵn sàng cho người dùng {user_id}, đang thử tải lại...")
        if not recommender.load_assets():
            print("Lỗi: Không thể tải lại tài nguyên gợi ý. Trả về lỗi 503.")
            return jsonify({"error": "Mô hình gợi ý chưa sẵn sàng. Vui lòng thử lại sau hoặc kích hoạt huấn luyện mô hình bằng POST /train_model."}), 503
        else:
            print("Tải lại tài nguyên gợi ý thành công.")

    try:
        print(f"Đang tạo gợi ý cho người dùng: {user_id}")
        recommendations = recommender.get_recommendations(user_id)
        
        result = []
        if recommendations: # Chỉ xử lý nếu có recommendations
            for prod in recommendations:
                result.append({
                    'prodId': str(prod.get('_id')), # Chuyển ObjectId về string
                    'prodName': prod.get('prodName'),
                    'prodPrice': prod.get('prodPrice'),
                    'prodImg': prod.get('prodImg', '/default-image.jpg') # Ảnh mặc định
                })
        print(f"Đã tạo {len(result)} gợi ý cho người dùng {user_id}.")
        return jsonify(result)
    except Exception as e:
        print(f"Lỗi khi tạo gợi ý cho người dùng {user_id}: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc() # In traceback để gỡ lỗi chi tiết hơn
        
        # Trả về các sản phẩm phổ biến nhất trong trường hợp lỗi hoặc không tìm thấy gợi ý
        print("Đang trả về các sản phẩm phổ biến nhất (fallback).")
        popular_fallback = recommender.get_popular_products(num_recommendations=10)
        fallback_result = []
        if popular_fallback:
            for prod in popular_fallback:
                fallback_result.append({
                    'prodId': str(prod.get('_id')),
                    'prodName': prod.get('prodName'),
                    'prodPrice': prod.get('prodPrice'),
                    'prodImg': prod.get('prodImg', '/default-image.jpg')
                })
        return jsonify(fallback_result), 200 # Trả về 200 OK với fallback


@app.route('/', methods=['GET'])
def home():
    return "Hệ thống gợi ý sản phẩm đang chạy. Vui lòng sử dụng các endpoint /train_model hoặc /recommend/<user_id>."


if __name__ == '__main__':
    # Initial load của mô hình và các assets khi ứng dụng Flask khởi động.
    # Nếu các file model chưa có hoặc bị hỏng, nó sẽ báo lỗi và chờ /train_model được gọi.
    initial_load()
    
    print("\n--------------------------------------------------")
    print("Ứng dụng Flask đã sẵn sàng.")
    print("Truy cập http://127.0.0.1:5000 để kiểm tra trạng thái.")
    print("Sử dụng endpoint POST http://127.0.0.1:5000/train_model để huấn luyện và lưu mô hình.")
    print("Sử dụng endpoint GET http://127.0.0.1:5000/recommend/<user_id> để nhận gợi ý.")
    print("--------------------------------------------------")
    
    app.run(debug=True, port=5000)