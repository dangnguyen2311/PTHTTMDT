package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.CategoryDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "categories")
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    @Id
    private String id;
    private String categoryName;
    private String categoryDescription;

    public CategoryDao toDao(){
        return new CategoryDao(id, categoryName, categoryDescription);
    }
}
