package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.ReceiptDao;
import com.example.btl_tmdt.payment.PaymentRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "receipts")
public class Receipt {
    @Id
    private String id;
    private Order order;
    private PaymentRequest paymentRequest;
    private LocalDateTime createdDate;


    public Receipt(Order order, PaymentRequest paymentRequest) {
        this.order = order;
        this.paymentRequest = paymentRequest;
        this.createdDate = LocalDateTime.now();
    }

    public ReceiptDao toDao() {
        return new ReceiptDao(id, order != null ? order.toDao() : null, paymentRequest, createdDate);
    }

//    private
}
