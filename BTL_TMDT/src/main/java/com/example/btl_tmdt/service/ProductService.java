package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.repository.CategoryRepo;
import com.example.btl_tmdt.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    ProductRepo prodRepo;
    @Autowired
    CategoryRepo categoryRepo;


    public void saveProd(Product product){
        prodRepo.save(product);
    }

    public void updateProdByProdId(String prodId, Product product){
//        prodRepo.updateProductByProdId(prodId, product);
//        Product product1 = prodRepo.getProductByProdId(prodId);
        prodRepo.deleteByProdId(prodId);
        prodRepo.save(product);
    }


    public List<Product> getProducts(){
        return prodRepo.findAll();

    }

    public void createProduct(Product product) {
        Category category = categoryRepo.findById(product.getCategory().getId()).get();
        product.setCategory(category);
        prodRepo.save(product);
    }


    public Product getProductById(String proId){
        return prodRepo.getProductByProdId(proId);
    }


    public void deleteProductById(Product product){
        prodRepo.delete(product);

    }
    public ProductDao getProductByName(String productName) {
        Product product = prodRepo.findProductByProdName(productName).orElse(null);
        if(product != null) {
            return product.toDao();
        }
        return null;
    }

//    public void deleteProductById(Product product){
//        prodRepo.deleteById(product.getProdId());
//    }


    public Optional<Product> findProductByName(String productName){
        return prodRepo.findProductByProdName(productName);
    }

    public void editProduct(Product product, String id) {
        Product productInDB = prodRepo.getProductByProdId(id);
        Category category = categoryRepo.findById(productInDB.getCategory().getId()).get();

        productInDB.setCategory(category);
        productInDB.setProdDescription(product.getProdDescription());
        productInDB.setProdName(product.getProdName());
        productInDB.setProdImg(product.getProdImg());
        productInDB.setProdPrice(Float.parseFloat(String.valueOf(product.getProdPrice())));
//        productInDB.setQuantity(product.getQuantity());

        prodRepo.save(productInDB);
    }

    public List<Product> getProductsByCategory(Category categoryDaoByName) {
        return prodRepo.getProductsByCategory(categoryDaoByName);
    }
}
