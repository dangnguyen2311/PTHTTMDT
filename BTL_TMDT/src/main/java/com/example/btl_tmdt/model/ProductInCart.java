package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.ProductInCartDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "products_in_cart")
@AllArgsConstructor
@NoArgsConstructor
public class ProductInCart {
    @Id
    private String id;
    private Cart cart;
    private Product product;
    private int quantity;
    private double totalPrice;

    public ProductInCartDao toDao() {
        return new ProductInCartDao(id,
                cart != null ? cart.toDao() : null,
                product != null ? product.toDao() : null,
                quantity,
                totalPrice);
    }
    public ProductInCart(Cart cart, Product product, int quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.totalPrice = product.getProdPrice() * quantity;
    }
}