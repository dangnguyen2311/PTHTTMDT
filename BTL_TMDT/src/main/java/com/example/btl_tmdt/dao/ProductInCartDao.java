package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.Cart;
import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.ProductInCart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductInCartDao {
    private String id;
    private CartDao cartDao;
    private ProductDao productDao;
    private int quantity;
    private double totalPrice;

    public ProductInCart toModel() {
        return new ProductInCart(
                id,
                cartDao != null ? cartDao.toModel() : null,
                productDao != null ? productDao.toModel() : null,
                quantity,
                totalPrice
        );
    }
}