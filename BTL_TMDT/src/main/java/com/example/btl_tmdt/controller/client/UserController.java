package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.CategoryDao;
import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.CategoryService;
import com.example.btl_tmdt.service.ProductService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    ProductService productService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    HttpSession session;

    // Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    // Xoá người dùng theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted");
    }

    // Đăng ký user mới
    @PostMapping("/register")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        boolean isUserExist = userService.getUsers().stream()
                .anyMatch(u -> u.getUserName().equals(user.getUserName()));

        if (isUserExist) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        userService.saveUser(user);
        return ResponseEntity.ok("User added");
    }

    // Lấy thông tin home page (dành cho user sau khi login)
    @GetMapping("/home")
    public ResponseEntity<?> getHomeData(HttpSession session) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        List<ProductDao> productDaos = productService.getProducts().stream()
                .map(Product::toDao).collect(Collectors.toList());

        List<CategoryDao> categoryDaos = categoryService.getCategories().stream()
                .map(Category::toDao).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("productDaos", productDaos);
        response.put("categoryDaos", categoryDaos);

        return ResponseEntity.ok(response);
    }

    // Lấy thông tin sản phẩm theo category
    @GetMapping("/category/{name}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String name) {
        Category category = categoryService.getCategoriesByname(name);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }

        List<ProductDao> productDaos = productService.getProducts().stream()
                .filter(p -> p.getCategory().getCategoryName().equals(name))
                .map(Product::toDao)
                .collect(Collectors.toList());

        Collections.shuffle(productDaos);

        Map<String, Object> response = new HashMap<>();
        response.put("categoryDao", category.toDao());
        response.put("categoryDaos", categoryService.getCategories().stream()
                .map(Category::toDao).collect(Collectors.toList()));
        response.put("productDaos", productDaos);

        return ResponseEntity.ok(response);
    }

    // Lấy thông tin user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpSession session) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        UserDao userDao = userService.getUserByUserName(userName).toDao();

        Map<String, Object> response = new HashMap<>();
        response.put("userDao", userDao);
        response.put("productDaos", productService.getProducts().stream()
                .map(Product::toDao).collect(Collectors.toList()));
        response.put("categoryDaos", categoryService.getCategories().stream()
                .map(Category::toDao).collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }

    // Cập nhật thông tin người dùng
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(HttpSession session,
                                               @RequestBody Map<String, String> updates) {
        String userName = (String) session.getAttribute("userName");
        if (userName == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        UserDao userDao = userService.getUserByUserName(userName).toDao();
        userDao.setUserFullName(updates.get("fullName"));
        userDao.setUserPhone(updates.get("phone"));
        userDao.setUserAddress(updates.get("address"));

        userService.updateUser(userDao);

        return ResponseEntity.ok(userDao);
    }
}
