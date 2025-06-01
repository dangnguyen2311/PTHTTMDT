package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDao {
    private String prodId;
    private String prodName;
    private String prodDescription;
    private Float prodPrice;
    private String prodNsx;
    private CategoryDao categoryDao;
    private String prodImg;
    private List<String> prodDetailImageList;

    public Product toModel(){
        return new Product(prodId, prodName, prodDescription, prodPrice, prodNsx, categoryDao.toModel(), prodImg, prodDetailImageList);
    }
}
