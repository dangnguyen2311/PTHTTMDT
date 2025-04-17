package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.*;
import com.example.btl_tmdt.model.Cart;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.ProductInCart;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.CartService;
import com.example.btl_tmdt.service.ProductInCartService;
import com.example.btl_tmdt.service.ProductService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/cart")
public class AdminCartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductInCartService productInCartService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private HttpSession session;

    private boolean isAdminUser() {
        String username = (String) session.getAttribute("userName");
        if (username == null) return false;
        User user = userService.getUserByUserName(username);
        return user != null && "2".equals(user.getUserRole());
    }

    @GetMapping("")
    public ResponseEntity<?> getAllCarts() {
//        if (!isAdminUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }

        List<CartDao> cartDaos = cartService.getAllCart()
                .stream().map(Cart::toDao).collect(Collectors.toList());
        return ResponseEntity.ok(cartDaos);
    }

    @GetMapping("/cart-item/{id}")
    public ResponseEntity<?> getCartItems(@PathVariable("id") String id) {
//        if (!isAdminUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }

        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart not found");
        }

        List<ProductInCart> productInCarts = productInCartService.getProductInCart(cart);
        List<ProductInCartDao> productInCartDaos = productInCarts.stream()
                .map(ProductInCart::toDao).collect(Collectors.toList());

        List<Product> allProducts = productService.getProducts();
        List<ProductDao> availableProducts = new ArrayList<>();

        for (Product p : allProducts) {
            boolean alreadyInCart = productInCarts.stream()
                    .anyMatch(pic -> pic.getProduct().getProdId().equals(p.getProdId()));
            if (!alreadyInCart) {
                availableProducts.add(p.toDao());
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("cart", cart.toDao());
        response.put("itemsInCart", productInCartDaos);
        response.put("availableProducts", availableProducts);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cart-item/{id}")
    public ResponseEntity<?> addItemToCart(@PathVariable("id") String id,
                                           @RequestBody ProductInCartDao productInCartDao) {
//        if (!isAdminUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }

        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart not found");
        }

        Product product = productService.getProductById(productInCartDao.getProductDao().getProdId());
        if (product == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid product");
        }

        productInCartDao.setCartDao(cart.toDao());
        productInCartDao.setProductDao(product.toDao());

//        ProductInCart saved =
        productInCartService.createProductInCart(productInCartDao.toModel());
        return ResponseEntity.status(HttpStatus.CREATED).body(productInCartDao);
    }

    @DeleteMapping("/cart-item/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable("id") String id) {
//        if (!isAdminUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }

        ProductInCart cartItem = productInCartService.getProductInCartById(id);
        if (cartItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }

        productInCartService.deleteProductInCart(cartItem);
        return ResponseEntity.ok("Deleted successfully");
    }
}
