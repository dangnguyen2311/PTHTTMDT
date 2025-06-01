package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderRepo extends MongoRepository<Order, String> {
    Order findByOrderId(String order_id);

    List<Order> findByUser(User user);
}
