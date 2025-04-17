package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.OrderDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Document(collection = "orders")
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    private String orderId;

    private User user; // 🌟 Nhúng trực tiếp đối tượng User

    private String address;
    private String phone;
    private String fullName;
    private Double total;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date orderTime;

    public OrderDao toDao() {
        return new OrderDao(orderId, user != null ? user.toDao() : null, address, phone, fullName, total, orderTime);
    }
}