package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.dao.ReturnOrderDao;
import com.example.btl_tmdt.model.ReturnOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnOrderRepo extends MongoRepository<ReturnOrder, String> {


    List<ReturnOrder> getReturnOrdersByOrderId(String orderId);

    ReturnOrderDao getReturnOrderByOrderId(String orderId);

    ReturnOrder getReturnOrderById(String id);
}
