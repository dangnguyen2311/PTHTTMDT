package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.InteractionLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionLogRepository extends MongoRepository<InteractionLog, String> {
    List<InteractionLog> findByUserId(String userId);
    // You can add more custom query methods if needed
}
