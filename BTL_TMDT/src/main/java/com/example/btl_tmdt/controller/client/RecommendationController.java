// com.example.btl_tmdt.controller.client.RecommendationController.java (NEW)
package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.service.RecommendationClient;
import com.example.btl_tmdt.service.UserService;
import com.example.btl_tmdt.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationClient recommendationClient;

    @Autowired
    private UserService userService;

    @Autowired
    private HttpSession session;

    @GetMapping("/for-user/{userId}")
    public ResponseEntity<?> getRecommendationsForUser(@PathVariable String userId) {
        // Kiểm tra xem userId có hợp lệ không (có thể lấy từ session nếu là người dùng hiện tại)
        // For simplicity, directly use the passed userId for now.
        // In real app, you'd get userId from session/security context
        String loggedInUserName = (String) session.getAttribute("userName");
        User currentUser = null;
        if (loggedInUserName != null) {
            currentUser = userService.getUserByUserName(loggedInUserName);
        }

        if (currentUser == null || !currentUser.getUserId().equals(userId)) {
            // Nếu người dùng yêu cầu gợi ý không phải là người đang đăng nhập
            // Hoặc không tìm thấy người dùng
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Bạn không có quyền truy cập gợi ý cho người dùng này."));
        }

        List<ProductDao> recommendations = recommendationClient.getRecommendationsForUser(userId);
        if (recommendations.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Trả về mảng rỗng nếu không có gợi ý
        }
        return ResponseEntity.ok(recommendations);
    }

    // Endpoint để kích hoạt huấn luyện mô hình (chỉ dành cho admin hoặc mục đích thử nghiệm)
    @PostMapping("/train-model")
    public ResponseEntity<?> triggerTrainModel() {
        // Bạn có thể thêm logic kiểm tra quyền admin ở đây
        String response = recommendationClient.triggerModelTraining();
        return ResponseEntity.ok(response);
    }
}