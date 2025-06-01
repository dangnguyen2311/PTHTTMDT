package com.example.btl_tmdt.controller.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/product")
public class AdminProductController {
    @Autowired
    ProductService productService;
    @Autowired
    CategoryService categoryService;
    @Autowired
    UserService userService;
    @Autowired
    HttpSession session;
    @Autowired
    Cloudinary cloudinary;
    public boolean checkUser(){
//        User user = (User) userService.getUserByUserName((String) session.getAttribute("userName"));
//        return user.getUserRole().equals("2");
        return true;
    }

//    @GetMapping("")
//    public String getProducts(Model model){
//        if(!checkUser()){
//            model.addAttribute("userDao", new UserDao());
//            return "client/login";
//        }
//        List<ProductDao> productDaoList = productService.getProducts().stream().map(Product::toDao).collect(Collectors.toList());
//        model.addAttribute("productDaos", productDaoList);
//
//        return "admin/product/products";
//    }
//
//    @GetMapping("/add-product")
//    public String addProductGet(Model model){
////        productService.saveProd(productDao.toModel());
////        List<ProductDao> productDaoList = (List<ProductDao>) model.getAttribute("products");
////        assert productDaoList != null;
////        productDaoList.add(productDao);
////        model.addAttribute("products", productDaoList);
//
//
//        // tạm thoời ể them san pham
////        if(!checkUser()){
////            model.addAttribute("userDao", new UserDao());
////            return "client/login";
////        }
//        ProductDao productDao = new ProductDao();
//        List<CategoryDao> categoryDaos = categoryService.getCategories().stream().map(Category::toDao)
//                .collect(Collectors.toList());
//
//        model.addAttribute("categoryDaos", categoryDaos);
//        model.addAttribute("productDao", productDao);
//        return "admin/product/add-product";
//    }
//
//    @PostMapping("/add-product")
//    public String addNewProductPost(Model model, @ModelAttribute(name = "productDao") ProductDao productDao,
//                                    @RequestParam("pictureFile") MultipartFile pictureFile) {
//
//        // tạm thoời ể them san pham
////        if(!checkUser()){
////            model.addAttribute("userDao", new UserDao());
////            return "client/login";
////        }
//        if (pictureFile.isEmpty()) {
//            model.addAttribute("error", "Please upload picture file");
//            return "redirect:/admin/product/add-product";
//        }
//
//        String fileName = StringUtils.cleanPath(pictureFile.getOriginalFilename());
//
//        String UPLOAD_DIR = "D:\\CodeJava\\BTL_TMDT\\src\\main\\resources\\static\\image";
//
////        try {
////            Path path = Paths.get(UPLOAD_DIR + fileName);
////            Files.copy(pictureFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
////        } catch (IOException e) {
////            e.printStackTrace();
////        }
////        productDao.setProdImg("\\image\\" + fileName);
//        try {
//            // Tải ảnh lên Cloudinary
//            Map uploadResult = cloudinary.uploader().upload(pictureFile.getBytes(),
//                    ObjectUtils.asMap("resource_type", "image"));
//
//            // Lấy URL công khai của ảnh từ Cloudinary
//            String imageUrl = (String) uploadResult.get("secure_url");
//
//            // Gán URL ảnh vào productDao
//            productDao.setProdImg(imageUrl);
//
//            // Lưu sản phẩm
//            productService.createProduct(productDao.toModel());
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            model.addAttribute("error", "Lỗi khi tải ảnh lên: " + e.getMessage());
//            System.out.println("loi luu duong dan anh");
//            return "redirect:/admin/product/add-product";
//        }
//
//
//
////        productService.createProduct(productDao.toModel());
//        return "redirect:/admin/product";
//    }
//
//    @GetMapping("/edit-product/{id}")
//    public String editProductGet(@PathVariable String id, Model model){
//        if(!checkUser()){
//            model.addAttribute("userDao", new UserDao());
//            return "client/login";
//        }
//        ProductDao productDao = productService.getProductById(id).toDao();
//        List<CategoryDao> categoryDaos = categoryService.getCategories().stream().map(Category::toDao).collect(Collectors.toList());
//        model.addAttribute("productDao", productDao);
//        model.addAttribute("categoryDaos", categoryDaos);
//        return "admin/product/edit-product";
//    }
//
//    @GetMapping("/search")
//    public String searchProd(@PathParam(value = "productName") String productname, Model model){
//        if(!checkUser()){
//            model.addAttribute("userDao", new UserDao());
//            return "client/login";
//        }
//        List<ProductDao> productDaoListByName = productService.findProductByName(productname).stream().map(Product::toDao).toList();
//        model.addAttribute("productDaos", productDaoListByName);
//        return "admin/product/products";
//    }
//
//    @PostMapping("/edit-product/{id}")
//    public String editProductPost(Model model, @PathVariable(name = "id") String id,
//                                  @ModelAttribute(name = "productDao") ProductDao productDao,
//                                  @RequestParam("pictureFile") MultipartFile pictureFile) {
//
//        if (pictureFile.isEmpty()) {
//            Product product = productService.getProductById(id);
//            productDao.setProdImg(product.getProdImg());
//        }
//
//        else {
//            String fileName = StringUtils.cleanPath(pictureFile.getOriginalFilename());
//
//
//            String UPLOAD_DIR = "D:\\File Java\\src\\Term_2_2023_2024\\BTL_TMDT\\src\\main\\resources\\static\\image\\";
//
//            try {
//                Path path = Paths.get(UPLOAD_DIR + fileName);
////                Files.copy(pictureFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//
//            productDao.setProdImg("\\image\\" + fileName);
//        }
//
//        productService.editProduct(productDao.toModel(), id);
//        return "redirect:/admin/product";
//    }
//
//    @GetMapping("/delete-product/{id}")
//    public String deleteProduct(@PathVariable(name = "id") String id, Model model){
//        if(!checkUser()){
//            model.addAttribute("userDao", new UserDao());
//            return "client/login";
//        }
//        Product productToDelete = productService.getProductById(id);
//        productService.deleteProductById(productToDelete);
////        model.addAttribute("products", productToDelete);
//        return "redirect:/admin/product";
//    }
//    @PostMapping("search-product/{name}")
//    public String searchProductByName(@PathVariable String name, Model model){
//        List<ProductDao> productByNameList = productService.getProducts().stream().map(Product::toDao).toList()
//                        .stream().filter(e -> e.getProdName().toLowerCase().contains(name.toLowerCase()))
//                        .collect(Collectors.toList());
//
//        model.addAttribute("productByNameList", productByNameList);
//        return "admin/product/products";
//    }
//
//    @GetMapping("/products-category")
//    public String getProductByCategory(@RequestBody CategoryDao categoryDao, Model model){
//        if(!checkUser()){
//            model.addAttribute("userDao", new UserDao());
//            return "client/login";
//        }
//        List<ProductDao> productDaoList = productService.getProducts().stream()
//                .map(Product::toDao).toList()
//                .stream().filter(e -> e.getCategoryDao().equals(categoryDao)).toList();
//        model.addAttribute("products", productDaoList);
//
//        return "admin/product/products";
//    }
    @GetMapping("")
    public ResponseEntity<List<ProductDao>> getAllProducts() {
        List<ProductDao> products = productService.getProducts()
                .stream().map(Product::toDao).collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping("")
    public ResponseEntity<?> addProduct(@ModelAttribute ProductDao productDao,
                                        @RequestParam("pictureFile") MultipartFile pictureFile) {
        if (pictureFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload picture file");
        }

        try {
            ProductDao existingProduct = productService.getProductByName(productDao.getProdName());
            if (existingProduct != null) {
                return ResponseEntity.badRequest().body("Product Name already exists");
            }

            Map uploadResult = cloudinary.uploader().upload(pictureFile.getBytes(),
                    ObjectUtils.asMap("resource_type", "image"));
            String imageUrl = (String) uploadResult.get("secure_url");
            productDao.setProdImg(imageUrl);

            productService.createProduct(productDao.toModel());

            return ResponseEntity.ok("Product created successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload image error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id,
                                           @ModelAttribute ProductDao productDao,
                                           @RequestParam(value = "pictureFile", required = false) MultipartFile pictureFile) {
        if (pictureFile != null && !pictureFile.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(pictureFile.getBytes(),
                        ObjectUtils.asMap("resource_type", "image"));
                String imageUrl = (String) uploadResult.get("secure_url");
                productDao.setProdImg(imageUrl);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Upload image error: " + e.getMessage());
            }
        } else {
            Product existing = productService.getProductById(id);
            productDao.setProdImg(existing.getProdImg());
        }

        productService.editProduct(productDao.toModel(), id);
        return ResponseEntity.ok("Product updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        Product product = productService.getProductById(id);
        productService.deleteProductById(product);
        return ResponseEntity.ok("Product deleted");
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDao>> searchProductByName(@RequestParam("name") String name) {
        List<ProductDao> result = productService.getProducts().stream()
                .map(Product::toDao)
                .filter(p -> p.getProdName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/category")
    public ResponseEntity<List<ProductDao>> getProductByCategory(@RequestParam String categoryId) {
        List<ProductDao> result = productService.getProducts().stream()
                .map(Product::toDao)
                .filter(p -> p.getCategoryDao() != null && p.getCategoryDao().getId().equals(categoryId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/form-data")
    public ResponseEntity<Map<String, Object>> getFormData() {
        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream().map(Category::toDao).collect(Collectors.toList());
        Map<String, Object> data = new HashMap<>();
        data.put("categories", categoryDaos);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDao> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product.toDao());
    }
}
