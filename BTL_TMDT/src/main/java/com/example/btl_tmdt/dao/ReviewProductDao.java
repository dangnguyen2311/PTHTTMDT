package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.ReviewProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReviewProductDao {
    private String id;
    private String userName;
    private String productId;
    private LocalDate createdDate;
    private String content;
    private int rating;
    private String status;

    public ReviewProductDao(String userName, String productId, LocalDate createdDate, String content, int rating, String status) {
        this.userName = userName;
        this.productId = productId;
        this.createdDate = createdDate;
        this.content = content;
        this.rating = rating;
        this.status = status;
    }
    public ReviewProduct toModel() {
        return new ReviewProduct(id, userName, productId, createdDate, content, rating, status);
    }
}
