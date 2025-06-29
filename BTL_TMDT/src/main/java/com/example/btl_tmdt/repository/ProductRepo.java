package com.example.btl_tmdt.repository;

import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo extends MongoRepository<Product, Integer> {
    Product getProductByProdId(String id);  //tuwj may sinh ra

//    @Query(value = "SELECT * FROM btl_web.product WHERE prod_name LIKE  \"%" + productName + "%\"", nativeQuery = true)
//    @Transactional
//    Optional<Product> findProductByProdName(@Param("productName") String productName);

//    @Query(value = "SELECT * FROM btl_tmdt.product WHERE prod_name LIKE CONCAT('%', ?1, '%')", nativeQuery = true)
    @Query("{ 'prodName': { $regex: ?0, $options: 'i' } }")
//    @Transactional
    Optional<Product> findProductByProdName(String productName);

    List<Product> getProductsByCategory(Category category);

    void deleteByProdId(String prodId);

    Product findByCategoryAndProdIdNot(Category category, String prodId);

    List<Product> findProductsByCategoryAndProdIdNot(Category category, String prodId);


//    void updateProductByProdId(String prodId, Product product);
}
