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

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {

    @Autowired
    UserService userService;

    @Autowired
    HttpSession session;

    @Autowired
    CategoryService categoryService;

    @Autowired
    ProductService productService;


    @GetMapping("/")
    public String homeRedirect() {
        String userName = (String) session.getAttribute("userName");

        if (userName == null) {
            return "redirect:/login";
        }

        return "redirect:/slide/1";
    }

//    @GetMapping("/slide/{id}")
//    public String home (Model model, HttpSession session,
//                        @PathVariable("id") Integer id) {
//
//        List<CategoryDao> categoryDaos = categoryService.getCategories()
//                .stream().map(e -> e.toDao()).collect(Collectors.toList());
//
//        List<ProductDao> listAllProductDao = productService.getProducts().stream()
//                .map(e -> e.toDao()).collect(Collectors.toList());
//
//        int pageNumber = listAllProductDao.size()/9;
//
//        List<List<ProductDao>> listPage = new ArrayList<>();
//        int index = 0;
//
//        for (int i = 0; i < pageNumber; i++) {
//            List<ProductDao> res = listAllProductDao.subList(index, index + 9);
//            listPage.add(res);
//            index += 9;
//        }
//
//        if(pageNumber == 0){
//            listPage.add(listAllProductDao);
//        }
//        Collections.shuffle(listPage.get(id - 1));
//
//        model.addAttribute("pageNumbers", pageNumber);
//        model.addAttribute("categoryDaos", categoryDaos);
//        model.addAttribute("productDaos", listPage.get(id - 1));
//
//
//        return "/client/home";
//    }
    @GetMapping("/slide/{id}")
    @ResponseBody // ĐÃ SỬA
    public ResponseEntity<?> getSlidePage(@PathVariable("id") Integer id, HttpSession session) {
        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream().map(Category::toDao).collect(Collectors.toList());

        List<ProductDao> allProducts = productService.getProducts()
                .stream().map(Product::toDao).collect(Collectors.toList());
        int pageNumber = (int) Math.ceil((double) allProducts.size() / 9);
        System.out.println("Số sản phẩm" + allProducts.size());
        if (pageNumber == 0) pageNumber = 1;

        List<List<ProductDao>> listPage = new ArrayList<>();
        int index = 0;

        for (int i = 0; i < pageNumber; i++) {
            int end = Math.min(index + 9, allProducts.size());
            listPage.add(allProducts.subList(index, end));
            index += 9;
        }

        List<ProductDao> selectedProducts = listPage.get(Math.min(id - 1, listPage.size() - 1));
//        Collections.shuffle(selectedProducts); // nếu muốn ngẫu nhiên

        return ResponseEntity.ok(Map.of(
                "productDaos", selectedProducts,
                "pageNumbers", pageNumber,
                "userName", session.getAttribute("userName"),
                "categoryDaos", categoryDaos
        ));
    }


    @GetMapping("/login")
    public String getHomeGet(Model model){
        UserDao userDao = new UserDao();
        model.addAttribute("userDao", userDao);
        return "client/login";
    }

//    @PostMapping("/login")
//    public String getHomePost(@ModelAttribute("userDao") UserDao userDao, Model model){
//        User user1 = userService.getUserByEmail(userDao.getUserEmail());
//
////        UserDao userDao2 =
//        if(user1 == null){
//            model.addAttribute("error", "Login failed");
//            System.out.println("Login failed");
//        }
//        else{
//            UserDao userDao1 = user1.toDao();
//            if(userDao.getUserPass().equals(userDao1.getUserPass())){
//                if(userDao1.getUserRole().equals("2")){
//                    session.setAttribute("userName", userDao1.getUserName());
//                    model.addAttribute("userName", userDao1.getUserName());
//                    return "redirect:/admin";
//                }
//                System.out.println("Login successfully");
//                session.setAttribute("userName", userDao1.getUserName());
//                model.addAttribute("userDao", userDao1);
//                return "redirect:/slide/1";
//            }
//        }
//        return "client/login";
//    }
    @PostMapping("/login") // ĐÃ SỬA
    public ResponseEntity<?> loginPost(@RequestBody Map<String, String> loginRequest) {
        String loginInput = loginRequest.get("userLogin"); // Có thể là email hoặc username
        String password = loginRequest.get("userPass");
        System.out.println(loginInput + ": " + password);
        if (loginInput == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing login info"));
        }

        User user = userService.getUserByUserName(loginInput);
        if (user == null) {
            user = userService.getUserByEmail(loginInput);
        }

        if (user == null || !user.getUserPass().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login failed"));
        }

        // Lưu session
        session.setAttribute("userName", user.getUserName());
        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream()
                .map(Category::toDao)
                .toList();
        // Trả về đường redirect dựa trên role
        String redirectUrl = "2".equals(user.getUserRole()) ? "/admin" : "/slide/1";
        System.out.println("redirectUrl" + redirectUrl + ",   " + user.getUserRole());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "redirect", redirectUrl,
                "userName", user.getUserName(),
                "userRole", user.getUserRole(),
                "categoryDaos", categoryDaos
        ));
    }


//    @GetMapping("/")

//    @GetMapping("/register")
//    public String registerGet (Model model) {
//
//        UserDao userDao = new UserDao();
//
//        List<CategoryDao> categoryDaos = categoryService.getCategories()
//                .stream().map(Category::toDao).collect(Collectors.toList());
//
//        List<ProductDao> productDaoS = productService.getProducts().stream()
//                .map(Product::toDao).collect(Collectors.toList());
//
//        model.addAttribute("userDao", userDao);
//        model.addAttribute("categoryDaos", categoryDaos);
//        model.addAttribute("productDaos", productDaoS);
//
//        return "/client/register";
//    }

//    @PostMapping("/register")
//    public String registerPost (Model model, @ModelAttribute(name = "userDao") UserDao userDao) {
//
//        userDao.setUserRole("1");
//
//        User user0 = userService.getUserByEmail(userDao.getUserEmail());
//        User user1 = userService.getUserByUserName(userDao.getUserName());
//
//        if (user0 != null || user1 != null) {
//            model.addAttribute("error", "Email or username is existed in system");
//            return "/client/register";
//        }
//
//        userService.createUser(userDao.toModel());
//
//        return "redirect:/login";
//    }
    @PostMapping("/register") // ĐÃ SỬA
    public ResponseEntity<?> register(@RequestBody UserDao userDao) {
        userDao.setUserRole("1"); // gán mặc định role là 1 - khách hàng
        System.out.println(userDao.getUserName());
        User userByEmail = userService.getUserByEmail(userDao.getUserEmail());
        User userByUsername = userService.getUserByUserName(userDao.getUserName());

        Map<String, String> response = new HashMap<>();

        if (userByEmail != null || userByUsername != null) {
            response.put("message", "Email hoặc Username đã tồn tại.");
            return ResponseEntity.badRequest().body(response);
        }

        // Lưu user
        try {
            userService.createUser(userDao.toModel());
            response.put("message", "Đăng ký thành công.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Lỗi khi lưu người dùng: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.removeAttribute("userName");
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }

//    @GetMapping("/category/{name}")
//    public String getProductByCategory(Model model, @PathVariable(name = "name") String name){
//        CategoryDao categoryDaoByName = categoryService.getCategoriesByname(name).toDao();
//        List<ProductDao> productDaoListByCategory = productService.getProductsByCategory(categoryDaoByName.toModel()).stream().map(Product::toDao).toList();
//        List<CategoryDao> categoryDaos = categoryService.getCategories().stream().map(Category::toDao).collect(Collectors.toList());
//
//        model.addAttribute("categoryDaos", categoryDaos);
//        model.addAttribute("categoryDao", categoryDaoByName);
//        model.addAttribute("productDaos", productDaoListByCategory);
//        return "/client/home";
//    }

}
