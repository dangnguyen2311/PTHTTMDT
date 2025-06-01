package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.ReviewProductDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Date;

@Data
@Document(collection = "review_product")
@AllArgsConstructor
@NoArgsConstructor
public class ReviewProduct {

    @Id
    private String id;
    private String userName;
    private String productId;
    private LocalDate createdDate;
    private String content;
    private int rating;
    private String status;

    public ReviewProduct(String userName, String productId, LocalDate createdDate, String content, int rating, String status) {
        this.userName = userName;
        this.productId = productId;
        this.createdDate = createdDate;
        this.content = content;
        this.rating = rating;
        this.status = status;
    }

    public ReviewProductDao toDao() {
        return new ReviewProductDao(id, userName, productId, createdDate, content, rating, status);
    }
}
