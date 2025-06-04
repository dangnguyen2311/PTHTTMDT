package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.ProductDao;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "products")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Product {
    @Id
    private String prodId;
    private String prodName;
    private String prodDescription;
    private Float prodPrice;
    private String prodNsx;
    private Category category; // chỉ lưu ID của Category
    private String prodImg;
    private ArrayList<String> prodDetailImageList;


    public ProductDao toDao() {
        return new ProductDao(prodId, prodName, prodDescription, prodPrice, prodNsx, category.toDao(), prodImg, prodDetailImageList);
    }

}
