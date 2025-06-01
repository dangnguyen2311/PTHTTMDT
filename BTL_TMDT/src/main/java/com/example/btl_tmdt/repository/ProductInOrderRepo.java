package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.ProductInOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductInOrderRepo extends MongoRepository<ProductInOrder, String> {
//    @Query("{ \"order._id\": \"?0\" }")
    List<ProductInOrder> getProductInOrdersByOrder(Order order);

    @Query("""
        {
          "order._id": { "$oid": ?0 }
        }
        """)
    List<ProductInOrder> findAllByOrder(String orderId);


    //    void deleteByOrder(Order order);
    void deleteProductInOrderByOrder(Order order);
}
