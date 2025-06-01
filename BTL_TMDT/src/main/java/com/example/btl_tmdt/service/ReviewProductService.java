package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.ReviewProductDao;
import com.example.btl_tmdt.model.ReviewProduct;
import com.example.btl_tmdt.repository.ReviewProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewProductService {
    @Autowired
    ReviewProductRepo reviewProductRepo;
    public void createReviewProduct(ReviewProduct reviewProduct) {
        reviewProductRepo.save(reviewProduct);
    }
    public List<ReviewProduct> getReviewProductByProductId(String productId) {
        return reviewProductRepo.findByProductId(productId);
    }
    public void deleteReviewProductById(String id) {
        ReviewProduct reviewProduct = reviewProductRepo.findById(id).isPresent() ? reviewProductRepo.findById(id).get() : null;
        if (reviewProduct != null) {
            reviewProduct.setStatus("deleted");
            reviewProductRepo.save(reviewProduct);
        }
        return;
    }
    public void updateReviewProduct(ReviewProduct reviewProduct) {
        reviewProductRepo.save(reviewProduct);
    }
    public List<ReviewProduct> getAllReviews() {
        return reviewProductRepo.findAll();
    }

    public ReviewProductDao getReviewById(String id) {
        Optional<ReviewProduct> reviewProduct = reviewProductRepo.findById(id);
//        if (reviewProduct.isPresent()) {
//            return reviewProduct.get().toDao();
//        } else {
//            return null;
//        }
        return reviewProduct.map(ReviewProduct::toDao).orElse(null);
    }
//    public ReviewProduct getReviewProductByUserIdAndProductId(String userId, String productId) {
//        return reviewProductRepo.findReviewProductByUserIdAndProductId(userId, productId).orElse(null);
//    }
}
