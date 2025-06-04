package com.example.btl_tmdt.payment;

import com.example.btl_tmdt.config.VNPAYConfig;
import com.example.btl_tmdt.model.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final VNPAYConfig vnPayConfig;

    @Autowired
    private PaymentRequestRepo paymentRepository;

    public PaymentDTO.VNPayResponse createVnPayPayment(long amount, String bankCode, String orderNote, HttpServletRequest request, String returnUrl) {
        //amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        //String bankCode = request.getParameter("bankCode");
        //String orderNote = request.getParameter("orderNote");
        //String returnUrl = request.getParameter("returnUrl");

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        if (orderNote == null || orderNote.isEmpty()) {
            throw new IllegalArgumentException("Order note cannot be empty");
        }
//        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
//        String bankCode = request.getParameter("bankCode");
        amount = amount*100L;

        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig(returnUrl);
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }

        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

//        vnpParamsMap.put("vnp_OrderInfo", orderNote);
        vnpParamsMap.replace("vnp_OrderNote", orderNote);
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentDTO.VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl).build();
    }

    public void savePaymentRequest(PaymentRequest paymentRequest) {
        paymentRepository.save(paymentRequest);

    }
    public void updatePaymentRequest(PaymentRequest paymentRequest) {
        paymentRepository.save(paymentRequest);
    }
}