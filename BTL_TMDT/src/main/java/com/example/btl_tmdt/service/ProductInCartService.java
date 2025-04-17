package com.example.btl_tmdt.service;


import com.example.btl_tmdt.dao.ProductInCartDao;
import com.example.btl_tmdt.model.Cart;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.ProductInCart;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.repository.CartRepo;
import com.example.btl_tmdt.repository.ProductInCartRepo;
import com.example.btl_tmdt.repository.ProductInOrderRepo;
import com.example.btl_tmdt.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductInCartService {
    @Autowired
    ProductInCartRepo productInCartRepo;

    @Autowired
    CartRepo cartRepo;


    @Autowired
    CartService cartService;
    @Autowired
    ProductService productService;

    public List<ProductInCart> getProductInCart(Cart cart) {
        return productInCartRepo.getProductInCartByCart(cart);
    }

    public void createProductInCart(ProductInCart productInCart) {
        Cart cart = cartService.getCartById(productInCart.getCart().getId());
        Product product = productService.getProductById(productInCart.getProduct().getProdId());
        productInCart.setCart(cart);
        productInCart.setProduct(product);
        productInCartRepo.save(productInCart);
    }

    public ProductInCart getProductInCartById(String id) {
        return productInCartRepo.findById(id).get();
    }

    public void deleteProductInCart(ProductInCart productInCart) {
        productInCartRepo.delete(productInCart);
    }


    public void updateProductInCart(String id, int quantity) {
        ProductInCart productInCart = productInCartRepo.findById(id).get();
        productInCart.setQuantity(quantity);

        productInCartRepo.save(productInCart);
    }

//    public void addOrUpdateProductInCart(Cart cart, String productId, int quantity) {
//        // Kiểm tra sản phẩm đã có trong giỏ chưa
//        Optional<ProductInCart> optional = productInCartRepo.findByCartIdAndProductId(cart.getId(), productId);
//
//        if (optional.isPresent()) {
//            // Nếu có rồi → cập nhật số lượng
//            ProductInCart productInCart = optional.get();
//            productInCart.setQuantity(productInCart.getQuantity() + quantity);
//            productInCartRepo.save(productInCart);
//        } else {
//            // Nếu chưa có → thêm mới
//            Product product = productRepo.findById(Integer.valueOf(productId))
//                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
//
//            ProductInCart newProductInCart = new ProductInCart();
//            newProductInCart.setCart(cart);
//            newProductInCart.setProduct(product);
//            newProductInCart.setQuantity(quantity);
//            productInCartRepo.save(newProductInCart);
//        }
//    }


//    public void updateProductInCart(ProductInCart productInCart){
//        productInCartRepo.save(productInCart);
//    }

    public boolean isExistProductInCart(ProductInCart productInCart){
        List<ProductInCart> productInCartToFind = productInCartRepo.findAll();
        return !productInCartToFind.isEmpty();
    }

    public void deleteProductInCartByUser(Cart cart) {
        productInCartRepo.deleteAllByCart(cart);
    }


//    public List<ProductInCartDao> getProductInCartByUser(User user) {
//        productInCartRepo.
//    }
}
