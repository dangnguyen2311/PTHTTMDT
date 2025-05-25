package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.ReviewProductDao;
import com.example.btl_tmdt.model.ReviewProduct;
import com.example.btl_tmdt.service.ReviewProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/review-product")
public class ReviewProductController {
    @Autowired
    private ReviewProductService reviewProductService;

    @GetMapping("/{productId}")
    public ResponseEntity<?> getReviewsByProductId(@PathVariable("productId") String productId) {
        try {
            List<ReviewProduct> optionalReviews = reviewProductService.getReviewProductByProductId(productId);

            if (optionalReviews.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<ReviewProductDao> reviewProductList = optionalReviews
                    .stream()
                    .map(ReviewProduct::toDao)
                    .toList();

            System.out.println("Số lượng review cho " + productId + ": " + reviewProductList.size());

            return ResponseEntity.ok(reviewProductList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error retrieving reviews"));
        }
    }


    @PostMapping("/add-review")
    public ResponseEntity<?> addReview(@RequestBody ReviewProductDao reviewProductDao) {
        try {
            ReviewProduct reviewProduct = new ReviewProduct();
            reviewProduct.setUserName(reviewProductDao.getUserName());
            reviewProduct.setProductId(reviewProductDao.getProductId());
            reviewProduct.setCreatedDate(LocalDate.now());
            reviewProduct.setRating(reviewProductDao.getRating());
            reviewProduct.setContent(reviewProductDao.getContent());
            reviewProductService.createReviewProduct(reviewProduct);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Review added successfully");
            response.put("review", reviewProduct);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error adding review");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
