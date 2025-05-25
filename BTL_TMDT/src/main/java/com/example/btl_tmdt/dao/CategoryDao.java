package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.Category;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDao {
    private String id;
    private String categoryName;
    private String categoryDescription;

    public Category toModel() {
        return new Category(id, categoryName, categoryDescription);
    }
}
