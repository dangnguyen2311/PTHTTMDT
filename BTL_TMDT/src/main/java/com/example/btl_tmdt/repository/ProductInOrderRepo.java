package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.ProductInOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductInOrderRepo extends MongoRepository<ProductInOrder, String> {
    List<ProductInOrder> getProductInOrdersByOrder(Order order);

    List<ProductInOrder> findAllByOrder(Order order);

//    void deleteByOrder(Order order);
    void deleteProductInOrderByOrder(Order order);
}
