package com.example.btl_tmdt.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "payment_requests")
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @Id
    private String id; // Unique identifier for the payment request

    private int amount;
    private String bankCode;
    private String note;
    private String returnUrl;
}