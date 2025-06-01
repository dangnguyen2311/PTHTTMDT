package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.CartDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "carts")
@AllArgsConstructor
@NoArgsConstructor
public class Cart {

    @Id
    private String id;

    private User user;

    public Cart(User user) {
        this.user = user;
    }

    public CartDao toDao() {
        return new CartDao(id, user != null ? user.toDao() : null);
    }
}
