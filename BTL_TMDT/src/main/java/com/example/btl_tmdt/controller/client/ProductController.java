package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.*;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.service.CategoryService;
import com.example.btl_tmdt.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(@RequestParam(value = "productName", required = false) String productName) {
        try {
            List<CategoryDao> categoryDaos = categoryService.getCategories()
                    .stream().map(Category::toDao).collect(Collectors.toList());

            List<ProductDao> productDaos = productService.getProducts().stream()
                    .map(Product::toDao)
                    .filter(e -> productName == null || e.getProdName().toLowerCase().contains(productName.toLowerCase()))
                    .collect(Collectors.toList());
            System.out.println("Number of products by Category: " + productDaos.size());
            Map<String, Object> response = new HashMap<>();
            response.put("categoryDaos", categoryDaos);
            response.put("productDaos", productDaos);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi tìm kiếm sản phẩm: " + e.getMessage()));
        }
    }

    @GetMapping("/product-detail/{id}")
    public ResponseEntity<?> getProduct(@PathVariable(name = "id") String id) {
        try {
            Product product = productService.getProductById(id);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }

            List<CategoryDao> categoryDaos = categoryService.getCategories()
                    .stream().map(Category::toDao).collect(Collectors.toList());

            List<ProductDao> productDaos = productService.getProducts().stream()
                    .map(Product::toDao).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("productDao", product.toDao());
            response.put("categoryDaos", categoryDaos);
            response.put("productDaos", productDaos);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lấy chi tiết sản phẩm: " + e.getMessage()));
        }
    }
    @GetMapping("/suggest")
    public ResponseEntity<?> getSuggestedProducts(@RequestParam String prodId) {
        ProductDao currentProduct = productService.getProductById(prodId).toDao();
        if (currentProduct == null) {
            return ResponseEntity.notFound().build();
        }

        List<ProductDao> suggested = productService
                .findByCategoryExceptSelf(currentProduct.getCategoryDao(), prodId, 2);

        System.out.println("suggested: "+suggested);

        return ResponseEntity.ok(Map.of("suggested", suggested));
    }
}
