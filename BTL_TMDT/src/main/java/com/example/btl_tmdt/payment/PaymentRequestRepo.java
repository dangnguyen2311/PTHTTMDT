package com.example.btl_tmdt.payment;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRequestRepo extends MongoRepository<PaymentRequest, String> {

}
