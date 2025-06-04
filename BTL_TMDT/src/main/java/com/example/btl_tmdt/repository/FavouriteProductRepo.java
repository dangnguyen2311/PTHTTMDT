package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.dao.FavouriteProductDao;
import com.example.btl_tmdt.model.FavouriteProduct;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavouriteProductRepo extends MongoRepository<FavouriteProduct, String> {
    List<FavouriteProduct> findAllByUser_UserName(String userUserName);

    FavouriteProductDao findAllByUserAndProduct(User user, Product product);

    FavouriteProductDao findByUserAndProduct(User user, Product product);
}
