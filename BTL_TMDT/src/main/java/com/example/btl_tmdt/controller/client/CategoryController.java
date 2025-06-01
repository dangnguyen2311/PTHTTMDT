package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.CategoryDao;
import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.service.CategoryService;
import com.example.btl_tmdt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/category")

public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ProductService productService;

    @GetMapping("/{name}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable("name") String name) {
        try {
            // Lấy category theo tên
            CategoryDao categoryDaoByName = categoryService.getCategoriesByname(name).toDao();
            System.out.println("Name Category to search" + categoryDaoByName);
            // Lấy danh sách sản phẩm theo category đó
            List<ProductDao> productDaoListByCategory = productService
                    .getProductsByCategory(categoryDaoByName.toModel())
                    .stream()
                    .map(Product::toDao)
                    .toList();

            // Lấy danh sách tất cả danh mục (category)
            List<CategoryDao> categoryDaos = categoryService
                    .getCategories()
                    .stream()
                    .map(Category::toDao)
                    .collect(Collectors.toList());

//            int pageNumber = (int) Math.ceil((double) productDaoListByCategory.size() / 9);
//            System.out.println("Số sản phẩm" + productDaoListByCategory.size());
//            if (pageNumber == 0) pageNumber = 1;
//
//            List<List<ProductDao>> listPage = new ArrayList<>();
//            int index = 0;
//
//            for (int i = 0; i < pageNumber; i++) {
//                int end = Math.min(index + 9, productDaoListByCategory.size());
//                listPage.add(productDaoListByCategory.subList(index, end));
//                index += 9;
//            }
//            int id = 2; // temporary value for testing
//            List<ProductDao> selectedProducts = listPage.get(Math.min(id - 1, listPage.size() - 1));

            // Tạo map dữ liệu trả về cho client
            Map<String, Object> response = new HashMap<>();
            response.put("categoryDao", categoryDaoByName);
            response.put("categoryDaos", categoryDaos);
            response.put("productDaos", productDaoListByCategory);
//            response.put("selectedProducts", selectedProducts);
//            response.put("pageNumbers", pageNumber);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy sản phẩm theo danh mục: " + e.getMessage()));
        }
    }

}
