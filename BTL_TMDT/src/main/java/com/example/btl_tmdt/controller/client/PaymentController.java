//package com.example.btl_tmdt.controller.client;
//
//import com.example.btl_tmdt.service.VnPayService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/payment")
//public class PaymentController {
//
//    private final VnPayService vnPayService;
//
//    public PaymentController(VnPayService vnPayService) {
//        this.vnPayService = vnPayService;
//    }
//
//    @GetMapping("/vnpay-create")
//    public String createVnpayUrl(@RequestParam int amount) {
//        return vnPayService.createPaymentUrl(amount);
//    }
//
//    @GetMapping("/vnpay-success")
//    public String vnpayReturn(@RequestParam Map<String, String> allParams) {
//        return vnPayService.handlePaymentResponse(allParams);
//    }
//}
