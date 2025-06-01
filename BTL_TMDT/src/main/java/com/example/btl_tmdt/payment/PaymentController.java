package com.example.btl_tmdt.payment;

import com.example.btl_tmdt.response.ResponseObject;
import com.example.btl_tmdt.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {
    @Autowired
    private final PaymentService paymentService;
    @Autowired
    private OrderService orderService;
    @PostMapping("/vn-pay")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(@RequestBody PaymentRequest paymentRequest,
                                                        HttpServletRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "Successssssss", paymentService.createVnPayPayment(paymentRequest.getAmount(),
                paymentRequest.getBankCode(),
                paymentRequest.getNote(),
                request
        ));
    }
    @GetMapping("/vn-pay-callback")
    public ResponseEntity<ResponseObject<PaymentDTO.VNPayResponse>> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");

        if ("00".equals(status)) {
            PaymentDTO.VNPayResponse response = PaymentDTO.VNPayResponse.builder()
                    .code("00")
                    .message("Success")
                    .paymentUrl("")
                    .build();
            //Update order status in DB

            return ResponseEntity.ok(new ResponseObject<>(HttpStatus.OK, "Success", response));
        } else {
            return ResponseEntity.badRequest().body(
                    new ResponseObject<>(HttpStatus.BAD_REQUEST, "Failed", null));
        }
    }

}