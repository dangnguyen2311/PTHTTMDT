package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Receipt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepo extends MongoRepository<Receipt, String> {
}
