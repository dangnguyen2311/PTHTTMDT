package com.example.btl_tmdt.payment;

import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.Receipt;
import com.example.btl_tmdt.response.ResponseObject;
import com.example.btl_tmdt.service.OrderService;
import com.example.btl_tmdt.service.ReceiptService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {
    @Autowired
    private final PaymentService paymentService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ReceiptService receiptService;
    @PostMapping("/vn-pay/{orderId}")
    public ResponseObject<PaymentDTO.VNPayResponse> pay(@RequestBody PaymentRequest paymentRequest,
                                                        @PathVariable(value = "orderId") String orderId,
                                                        HttpServletRequest request) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return new ResponseObject<>(HttpStatus.BAD_REQUEST, "Order not found", null);
        }
        Receipt receipt = new Receipt();
        receipt.setOrder(order);
        receipt.setPaymentRequest(paymentRequest);
        receipt.setCreatedDate(LocalDateTime.now());
        receiptService.saveReceipt(receipt);
        paymentService.savePaymentRequest(paymentRequest);

        return new ResponseObject<>(HttpStatus.OK, "Successssssss", paymentService.createVnPayPayment(paymentRequest.getAmount(),
                paymentRequest.getBankCode(),
                paymentRequest.getNote(),
                request,
                paymentRequest.getReturnUrl()
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