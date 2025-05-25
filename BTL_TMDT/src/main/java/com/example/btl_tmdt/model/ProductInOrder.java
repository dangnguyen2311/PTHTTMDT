package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.ProductInOrderDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "products_in_order")
@AllArgsConstructor
@NoArgsConstructor
public class ProductInOrder {
    @Id
    private String id;
    private Order order;
    private Product product;
    private Integer quantity;
    private Double totalPrice;

    public ProductInOrder(Order order, Product product, int quantity) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
    }

    public ProductInOrderDao toDao() {
        return new ProductInOrderDao(id,
                order != null ? order.toDao() : null,
                product != null ? product.toDao() : null,
                quantity,
                totalPrice);
    }
}