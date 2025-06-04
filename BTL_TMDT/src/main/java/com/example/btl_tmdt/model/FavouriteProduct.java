package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.FavouriteProductDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DialectOverride;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "favourite_products")
@AllArgsConstructor
@NoArgsConstructor
public class FavouriteProduct {
    @Id
    private String id;
    private User user;
    private Product product;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private boolean isDeleted;

    public FavouriteProduct(String id, User user, Product product) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.createdDate = LocalDateTime.now();
        this.modifiedDate = LocalDateTime.now();
        this.isDeleted = false;
    }
    public FavouriteProductDao toDao() {
        return new FavouriteProductDao(id, user != null ? user.toDao() : null, product != null ? product.toDao() : null, createdDate, modifiedDate, isDeleted);
    }
}
