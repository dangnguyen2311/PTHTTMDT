package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.ReviewProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository

public interface ReviewProductRepo extends MongoRepository<ReviewProduct, String> {

    List<ReviewProduct> findByProductId(String productId);
}
