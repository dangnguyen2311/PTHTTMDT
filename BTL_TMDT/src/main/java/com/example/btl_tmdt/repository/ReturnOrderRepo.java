package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.ReturnOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnOrderRepo extends MongoRepository<ReturnOrder, String> {


}
