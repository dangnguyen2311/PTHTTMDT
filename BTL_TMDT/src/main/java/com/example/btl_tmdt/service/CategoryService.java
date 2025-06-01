package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.CategoryDao;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    CategoryRepo categoryRepo;

    public List<Category> getCategories(){
        return categoryRepo.findAll();
    }

    public Category getCategoriesByname(String category_name) {
        return categoryRepo.findCategoryByCategoryName(category_name);
    }

    public Optional<Category> getCategoryById(String id){
        return categoryRepo.findById(id);
    }

    public void deleteCategory(Category category){
        categoryRepo.delete(category);
    }

    public void editCategory(Category categoryToEdit, Category category){
//        Category categoryToEdit = categoryRepo.findById(category.getCategoryId()).get();

        categoryToEdit.setCategoryName(category.getCategoryName());
        categoryToEdit.setCategoryDescription(category.getCategoryDescription());
        categoryRepo.delete(category);
        categoryRepo.save(categoryToEdit);
    }


    public void saveCategory(CategoryDao categoryDao) {
        categoryRepo.save(categoryDao.toModel());
    }

}
