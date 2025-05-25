package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.CartService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/admin/user")
public class AdminUserController {
    @Autowired
    UserService userService;
    @Autowired
    HttpSession session;
    private boolean checkUser() {
        String username = (String) session.getAttribute("userName");
        if (username == null) return false;

        User user = userService.getUserByUserName(username);
        return user != null && "2".equals(user.getUserRole());
    }

    // Lấy danh sách tất cả user
    @GetMapping("")
    public ResponseEntity<?> getAllUsers() {
//        if (!checkUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn không có quyền truy cập");
//        }

        List<UserDao> userDaos = userService.getUsers().stream()
                .map(User::toDao)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDaos);
    }

    // Lấy user theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
//        if (!checkUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn không có quyền truy cập");
//        }

        User user = userService.getUserByUserId(id);
        return ResponseEntity.ok(user.toDao());
    }

    // Thêm user mới
    @PostMapping("")
    public ResponseEntity<?> addNewUser(@RequestBody UserDao userDao) {
        User existingUsername = userService.getUserByUserName(userDao.getUserName());
        User existingEmail = userService.getUserByEmail(userDao.getUserEmail());

        if (existingUsername != null || existingEmail != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username hoặc Email đã tồn tại trong hệ thống");
        }

        userService.saveUser(userDao.toModel());
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
    }

    // Cập nhật user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserDao userDao) {
        userService.updateUser(userDao);
        return ResponseEntity.ok("User updated successfully");
    }

    // Xóa user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Dashboard (tùy vào mục đích, có thể bỏ endpoint này)
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        return ResponseEntity.ok("Welcome to Admin Dashboard");
    }
}
