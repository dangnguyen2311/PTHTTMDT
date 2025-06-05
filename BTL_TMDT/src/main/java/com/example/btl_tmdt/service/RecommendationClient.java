package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.ProductDao;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient; // THÊM IMPORT NÀY
import reactor.core.publisher.Mono; // THÊM IMPORT NÀY

import java.util.Collections;
import java.util.List;

@Service
public class RecommendationClient {

    @Value("${recommendation.service.url}") // Cấu hình trong application.properties
    private String recommendationServiceUrl;

    private final WebClient webClient; // THAY ĐỔI TỪ RestTemplate SANG WebClient

    // Constructor sử dụng WebClient.Builder để cấu hình WebClient
    // Đảm bảo bạn có một bean WebClient.Builder trong cấu hình Spring của mình
    public RecommendationClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(recommendationServiceUrl).build();
    }

    public List<ProductDao> getRecommendationsForUser(String userId) {
        try {
            // Sử dụng WebClient để thực hiện cuộc gọi GET
            // .uri(uriBuilder -> uriBuilder.path("/recommend/{userId}").build(userId))
            // Tạo URI với userId
            // .retrieve(): Bắt đầu truy xuất phản hồi
            // .bodyToFlux(ProductDao.class): Chuyển đổi phản hồi thành một Flux<ProductDao> (cho danh sách)
            // .collectList(): Thu thập các phần tử của Flux thành một Mono<List<ProductDao>>
            // .block(): Chặn luồng cho đến khi kết quả có sẵn (sử dụng cẩn thận trong môi trường không chặn)
            List<ProductDao> recommendedProducts = webClient.get()
                    .uri("/recommend/{userId}", userId)
                    .retrieve()
                    .bodyToFlux(ProductDao.class)
                    .collectList()
                    .block(); // Chặn cho mục đích đơn giản, xem xét sử dụng reactive programming cho production

            // Xử lý trường hợp recommendedProducts là null nếu không có lỗi nhưng không có dữ liệu
            return recommendedProducts != null ? recommendedProducts : Collections.emptyList();

        } catch (Exception e) {
            System.err.println("Lỗi khi gọi dịch vụ gợi ý: " + e.getMessage());
            // Xử lý lỗi, có thể trả về danh sách trống hoặc sản phẩm phổ biến
            return Collections.emptyList(); // Trả về danh sách rỗng khi có lỗi
        }
    }

    // Phương thức để gọi API kích hoạt huấn luyện mô hình (dùng cho mục đích admin/lập lịch)
    public String triggerModelTraining() {
        try {
            // Sử dụng WebClient để thực hiện cuộc gọi POST
            // .uri("/train_model"): Đường dẫn API
            // .retrieve(): Bắt đầu truy xuất phản hồi
            // .bodyToMono(String.class): Chuyển đổi phản hồi thành một Mono<String>
            // .block(): Chặn luồng cho đến khi kết quả có sẵn
            String response = webClient.post()
                    .uri("/train_model")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Chặn cho mục đích đơn giản

            return response;
        } catch (Exception e) {
            System.err.println("Lỗi khi kích hoạt huấn luyện mô hình: " + e.getMessage());
            return "{\"message\": \"Lỗi: " + e.getMessage() + "\"}";
        }
    }
}