package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.CategoryDao;
import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.CategoryService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/category")
public class AdminCategoryController {

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    HttpSession session;

    private boolean checkUser() {
//        String username = (String) session.getAttribute("userName");
//        if (username == null) return false;
//        User user = userService.getUserByUserName(username);
//        return user != null && "2".equals(user.getUserRole());
        return true;
    }

    @GetMapping("")
    public ResponseEntity<?> getCategoryList() {
        if (!checkUser()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        List<Category> categoryList = categoryService.getCategories();
        return ResponseEntity.ok(categoryList);
    }

    @GetMapping("/add-category")
    public ResponseEntity<?> getAddCategoryTemplate() {
        if (!checkUser()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        CategoryDao emptyCategory = new CategoryDao();
        return ResponseEntity.ok(emptyCategory);
    }

    @PostMapping("/add-category")
    public ResponseEntity<?> addCategory(@RequestBody CategoryDao categoryDao) {
        if (!checkUser()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Category existed = categoryService.getCategoriesByname(categoryDao.getCategoryName());
        if (existed != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Category already exists!");
        }

//        Category newCategory =
                categoryService.saveCategory(categoryDao);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryDao);
    }

    @GetMapping("/edit-category/{id}")
    public ResponseEntity<?> getCategoryToEdit(@PathVariable("id") String id) {
        if (!checkUser()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Category category = categoryService.getCategoryById(id).isPresent() ? categoryService.getCategoryById(id).get() : null;


        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }
        System.out.println("Category to edit + e1: " + category.getCategoryName());
        return ResponseEntity.ok(category.toDao());
    }

    @PostMapping("/edit-category/{id}")
    public ResponseEntity<?> editCategory(@PathVariable("id") String id,
                                          @RequestBody CategoryDao categoryDao) {
        if (!checkUser()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Category categoryToEdit = categoryService.getCategoryById(id).isPresent() ? categoryService.getCategoryById(id).get() : null;
        if (categoryToEdit == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }

//        Category updated =
                categoryService.editCategory(categoryToEdit, categoryDao.toModel());
        return ResponseEntity.ok(categoryDao);
    }

    @DeleteMapping("/delete-category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") String id) {
        if (!checkUser()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        System.out.println("categoryID = " + id);
        Category category = categoryService.getCategoryById(id).isPresent() ? categoryService.getCategoryById(id).get() : null;
        System.out.println("category = " + category);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }

        categoryService.deleteCategory(category);
        return ResponseEntity.ok("Deleted successfully");
    }
}
