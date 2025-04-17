package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Cart;
import com.example.btl_tmdt.model.ProductInCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductInCartRepo extends MongoRepository<ProductInCart, String> {

    List<ProductInCart> getProductInCartByCart(Cart cart);

    void deleteAllByCart(Cart cart);

//    Optional<ProductInCart> findByCartIdAndProductId(String id, String productId);
//    List<ProductInCart> getProductInCartBy
}
