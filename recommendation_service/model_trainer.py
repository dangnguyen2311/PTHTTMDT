
from lightfm import LightFM
import pickle
import os

class ModelTrainer:
    def __init__(self, model_dir='models'):
        self.model = None
        self.model_path = os.path.join(model_dir, 'lightfm_model.pkl')
        os.makedirs(model_dir, exist_ok=True)

    def train(self, interactions_matrix, item_features_matrix, epochs=50, num_components=30, item_alpha=1e-6, user_alpha=1e-6):
        """
        Huấn luyện mô hình LightFM.
        """
        self.model = LightFM(
            loss='warp',  # WARP (Weighted Approximate-Rank Pairwise) loss, tốt cho implicit feedback
            no_components=num_components,
            item_alpha=item_alpha,
            user_alpha=user_alpha # Thêm user_alpha nếu có ý định sử dụng user_features
        )
        print(f"Bắt đầu huấn luyện mô hình với {epochs} epochs...")
        self.model.fit(
            interactions=interactions_matrix,
            item_features=item_features_matrix,
            # user_features=user_features_matrix, # uncomment nếu có user features
            epochs=epochs,
            num_threads=4 # Số luồng CPU sử dụng
        )
        print("Huấn luyện mô hình hoàn tất.")
        self.save_model()
        return self.model

    def save_model(self):
        """Lưu trữ mô hình đã huấn luyện."""
        if self.model:
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            print(f"Mô hình đã được lưu tại: {self.model_path}")
        else:
            print("Không có mô hình để lưu. Vui lòng huấn luyện mô hình trước.")

    def load_model(self):
        """Tải mô hình đã huấn luyện."""
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            print("Mô hình LightFM đã được tải.")
            return True
        except FileNotFoundError:
            print("Không tìm thấy mô hình. Vui lòng huấn luyện mô hình trước.")
            return False

# Example usage (for testing)
if __name__ == "__main__":
    from data_processor import DataProcessor

    processor = DataProcessor()
    try:
        interactions_df, products_df = processor.load_data()
        interactions_matrix, item_features_matrix, _, _, _, _, _, _ = \
            processor.preprocess(interactions_df, products_df)

        trainer = ModelTrainer()
        trainer.train(interactions_matrix, item_features_matrix)
    except ValueError as e:
        print(f"Error during training: {e}")