package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.Receipt;
import com.example.btl_tmdt.payment.PaymentRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptDao {
    private String id;
    private OrderDao orderDao;
    private PaymentRequest paymentRequest;
    private LocalDateTime createdDate;

    public ReceiptDao(OrderDao order, PaymentRequest paymentRequest) {
        this.orderDao = order;
        this.paymentRequest = paymentRequest;
        this.createdDate = LocalDateTime.now();
    }

    public Receipt toModel() {
        return new Receipt(id, orderDao.toModel(), paymentRequest, createdDate);
    }
}
