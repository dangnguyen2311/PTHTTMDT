package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.ReviewProductDao;
import com.example.btl_tmdt.model.ReviewProduct;
import com.example.btl_tmdt.service.ReviewProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/review")
public class AdminReviewController {
    @Autowired
    private ReviewProductService reviewService;

    @GetMapping("/list")
    public ResponseEntity<?> getAllReviews() {

        return ResponseEntity.ok(Map.of(
                "reviews", reviewService.getAllReviews().stream()
                        .map(ReviewProduct::toDao)
                        .toList(),
                "message", "Successfully retrieved all reviews"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        ReviewProductDao reviewToDeleteDao = reviewService.getReviewById(id);

        if (reviewToDeleteDao != null) {
            reviewService.deleteReviewProductById(id);
            return ResponseEntity.ok().body("Đã xóa review có ID = " + id);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy review có ID = " + id);
        }
    }
}
