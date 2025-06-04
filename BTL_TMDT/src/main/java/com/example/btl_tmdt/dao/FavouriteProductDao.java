package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.FavouriteProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavouriteProductDao {
    private String id;
    private UserDao userDao;
    private ProductDao productDao;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private boolean isDeleted;

    public FavouriteProductDao(String id, UserDao user, ProductDao product) {
        this.id = id;
        this.userDao = user;
        this.productDao = product;
        this.createdDate = LocalDateTime.now();
        this.modifiedDate = LocalDateTime.now();
        this.isDeleted = false;
    }
    public FavouriteProduct toModel(){
        return new FavouriteProduct(id, userDao.toModel(), productDao.toModel(), createdDate, modifiedDate, isDeleted);
    }
}
