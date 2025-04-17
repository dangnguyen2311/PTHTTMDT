package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.CategoryDao;
import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.dao.ProductInCartDao;
import com.example.btl_tmdt.model.*;
import com.example.btl_tmdt.service.*;
import jakarta.servlet.http.HttpSession;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductInCartService productInCartService;

    @GetMapping("/my-cart")
    public ResponseEntity<?> getCartDetail(HttpSession session) {
        String username = (String) session.getAttribute("userName");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Bạn chưa đăng nhập."));
        }

        User user = userService.getUserByUserName(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Không tìm thấy người dùng."));
        }

        Cart cart = cartService.getCartByUser(user);
        List<ProductInCartDao> productInCartDaos = productInCartService.getProductInCart(cart)
                .stream().map(ProductInCart::toDao).collect(Collectors.toList());

        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream().map(Category::toDao).collect(Collectors.toList());

        List<ProductDao> productDaos = productService.getProducts()
                .stream().map(Product::toDao).collect(Collectors.toList());

        double totalPrice = productInCartDaos.stream()
                .mapToDouble(e -> e.getQuantity() * e.getProductDao().getProdPrice())
                .sum();

        return ResponseEntity.ok(Map.of(
                "cart", cart.toDao(),
                "categories", categoryDaos,
                "products", productDaos,
                "productInCartDaos", productInCartDaos,
                "totalPrice", totalPrice
        ));
    }



//    @GetMapping("/add-to-cart")
//    public String adDaoCart (Model model, HttpSession session,
//                             @RequestParam("id") String id,
//                             @RequestParam("quantity") int quantity) {
//
//        User user = userService.getUserByUserName((String) session.getAttribute("userName"));
//        if (user == null)
//            return "redirect:/login";
//
//        System.out.println("UserName add-to-cart: "+ user.getUserName());
//
//        Cart cart = cartService.getCartByUser(user);
//        Product product = productService.getProductById(id);
//
//        List<ProductInCart> productInCartList = productInCartService.getProductInCart(cart);
//        if(productInCartList.stream().anyMatch(e -> e.getProduct() == product)){
//            for(ProductInCart i: productInCartList){
//                if(i.getProduct().equals(product)){
////                    i.setQuantity(i.getQuantity() + 1);
//                    productInCartService.updateProductInCart(i.getId(), i.getQuantity() + 1);
//                }
//            }
//        }
//        else{
//            ProductInCart productInCart = new ProductInCart(cart, product, 1);
//            productInCart.setQuantity(quantity);
//            productInCartService.createProductInCart(productInCart);
//        }
// //        if(productInCartService.isExistProductInCart(productInCart)){
// //            productInCartService.updateProductInCart(productInCart.getId(), productInCart.getQuantity() + 1);
// //        }
//
// //        productInCartService.createNewCart();
// //        List<ProductInCartDao> productInCartDaos = productInCartService.getProductInCartByUser(user);
//
//        return "redirect:/my-cart";
//    }

    @PostMapping("/add-to-cart") //ĐÃ SỬA
    public ResponseEntity<?> addToCart(
            HttpSession session,
            @RequestParam("id") String id,
            @RequestParam("quantity") int quantity) {

        String userName = (String) session.getAttribute("userName");
        User user = userService.getUserByUserName(userName);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Chưa đăng nhập"));
        }

        Cart cart = cartService.getCartByUser(user);
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Sản phẩm không tồn tại"));
        }

        List<ProductInCart> productInCartList = productInCartService.getProductInCart(cart);
        boolean exists = false;
        for (ProductInCart item : productInCartList) {
            if (item.getProduct().equals(product)) {
                productInCartService.updateProductInCart(item.getId(), item.getQuantity() + quantity);
                exists = true;
                break;
            }
        }

        if (!exists) {
            ProductInCart productInCart = new ProductInCart(cart, product, quantity);
            productInCartService.createProductInCart(productInCart);
        }

        return ResponseEntity.ok(Map.of("message", "Thêm vào giỏ hàng thành công"));
    }

//    @PostMapping("/update-cart/{id}")
//    public String updateCart (@PathVariable("id") String id,
//                              @RequestParam("quantity") int quantity){
//
//        if (quantity == 0)
//            productInCartService.deleteProductInCart(productInCartService.getProductInCartById(id));
//        else productInCartService.updateProductInCart(id, quantity);
//
//        return "redirect:/my-cart";
//    }
    @PostMapping("/update-cart/{id}")
    public ResponseEntity<?> updateCart(
            @PathVariable("id") String id,
            @RequestParam("quantity") int quantity) {
        try {
            if (quantity <= 0) {
                productInCartService.deleteProductInCart(productInCartService.getProductInCartById(id));
            } else {
                productInCartService.updateProductInCart(id, quantity);
            }
            return ResponseEntity.ok(Map.of("message", "Cập nhật giỏ hàng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi cập nhật nha bạn ơi: " + e.getMessage()));
        }
    }

    @PostMapping("/remove-cart/{id}")
    public ResponseEntity<?> removeCart(@PathVariable("id") String id) {
        try {
            productInCartService.deleteProductInCart(productInCartService.getProductInCartById(id));
            return ResponseEntity.ok(Map.of("message", "Xóa sản phẩm khỏi giỏ hàng thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi xóa: " + e.getMessage()));
        }
    }


//    @PostMapping("/add-to-cart")
//    public ResponseEntity<?> addToCart(
//            @RequestParam("productId") String productId,
//            @RequestParam("quantity") int quantity,
//            HttpSession session) {
//        String username = (String) session.getAttribute("userName");
//        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
//
//        try {
//            User user = userService.getUserByUserName(username);
//            Cart cart = cartService.getCartByUser(user);
//            productInCartService.addOrUpdateProductInCart(cart, productId, quantity);
//            return ResponseEntity.ok(Map.of("message", "Đã thêm vào giỏ hàng"));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi: " + e.getMessage()));
//        }
//    }


}
