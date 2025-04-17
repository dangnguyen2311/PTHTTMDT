package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Cart;
import com.example.btl_tmdt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends MongoRepository<Cart, String> {
    Cart getCartByUser(User user);

}
