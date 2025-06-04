package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.*;
import com.example.btl_tmdt.model.*;
import com.example.btl_tmdt.repository.UserRepo;
import com.example.btl_tmdt.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private CartService cartService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ReviewProductService reviewProductService;
    @Autowired
    private ReturnOrderService returnOrderService;

    @Autowired
    HttpSession session;

    public boolean checkUser() {
        User user = (User) userService.getUserByUserName((String) session.getAttribute("userName"));
        return user.getUserRole().equals("2");
    }

    // Endpoint to get admin data
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Integer>> getAdminHome() {
//        if (!checkUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
//        }
        List<Product> products = productService.getProducts();
        List<Cart> carts = cartService.getAllCart();
        List<User> users = userService.getUsers();
        List<OrderDao> orders = orderService.getOrders();
        List<CategoryDao> categoryDaos = categoryService.getCategories().stream().map(Category::toDao).toList();
        List<ReviewProductDao> reviewProductDaos = reviewProductService.getAllReviews().stream().filter(review -> !"deleted".equalsIgnoreCase(review.getStatus())).map(ReviewProduct::toDao).toList();
        List<ReturnOrderDao> returnOrderDaos = returnOrderService.getAllReturnOrders();


        Map<String, Integer> dashboardData = new HashMap<>();
        dashboardData.put("numberOfProduct", products.size());
        dashboardData.put("numberOfCart", carts.size());
        dashboardData.put("numberOfUser", users.size());
        dashboardData.put("numberOfOrder", orders.size());
        dashboardData.put("numberOfCategory", categoryDaos.size());
        dashboardData.put("numberOfReview", reviewProductDaos.size());
        dashboardData.put("numberOfReturnOrder", returnOrderDaos.size());

        return ResponseEntity.ok(dashboardData);
    }

    // Endpoint to handle login
    @PostMapping("/login")
    public ResponseEntity<?> adminLoginPost(@RequestBody User user) {
        User userByUserName = userService.getUserByUserName(user.getUserName());
        System.out.println("Admin dang nhap: "+user.getUserName());
        if(userByUserName == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if(!userByUserName.getUserRole().equals("2")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed, user is not admin");
        }
        else{
            return ResponseEntity.ok(Map.of(
                    "message", "Login successfully",
                    "adminName", userByUserName.getUserName()
            ));
        }


//        if (user1 != null || user2 != null) {
//            assert user1 != null;
//            if (user1.getUserPass().equals(user.getUserPass()) || user2.getUserPass().equals(user.getUserPass())) {
//                if (user.getUserRole().equals("1"))
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Login failed, user is not admin");
//                return ResponseEntity.ok(Map.of(
//                        "message", "Login successfully",
//                        "adminName", user1.getUserName()
//                ));
//            }
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Login failed");
    }

    // Endpoint to handle logout
    @GetMapping("/logout")
    public ResponseEntity<String> adminLogout() {
        session.removeAttribute("userName");
        return ResponseEntity.ok("Logged out successfully");
    }
}

//
//@Controller
//@RequestMapping("/admin")
//public class AdminController {
//    @Autowired
//    private UserService userService;
//    @Autowired
//    private ProductService productService;
//    @Autowired
//    private CartService cartService;
//    @Autowired
//    private OrderService orderService;
//
//    @Autowired
//    HttpSession session;
//    public boolean checkUser(){
//        User user = (User) userService.getUserByUserName((String) session.getAttribute("userName"));
//        return user.getUserRole().equals("2");
//    }
//
//    @GetMapping("")
//    public String getAdminHome(Model model){
//        if(!checkUser()){
//            model.addAttribute("userDao", new UserDao());
//            return "client/login";
//        }
//        List<Product> products = productService.getProducts();
//        List<Cart> carts = cartService.getAllCart();
//        List<User> users = userService.getUsers();
//        List<OrderDao> orders = orderService.getOrders();
//        model.addAttribute("numberOfProduct", products.size());
//        model.addAttribute("numberOfCart", carts.size());
//        model.addAttribute("numberOfUser", users.size());
//        model.addAttribute("numberOfOrder", orders.size());
//
//        return "admin/home";
//    }
//
//    @GetMapping("/login")
//    public String adminLoginGet(Model model){
//
//        return "admin/login";
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<String> adminLoginPost(@RequestBody User user, Model model){
//        User user1 = userService.getUserByUserName(user.getUserName());
//        User user2 = userService.getUserByEmail(user.getUserEmail());
//
//        if(user1 != null && user2 != null){
//            if(user1.getUserPass().equals(user.getUserPass()) || user2.getUserPass().equals(user.getUserPass())){
//                if(user.getUserRole().equals("1")) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Login failed, user is not admin");
//                return ResponseEntity.ok("Login successfully");
//            }
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Login failed");
//    }
//
//    @GetMapping("/logout")
//    public String adminLogout(Model model){
//        session.removeAttribute("userName");
//        model.addAttribute("userDao", new UserDao());
//        return "redirect:/login";
//    }
//}
