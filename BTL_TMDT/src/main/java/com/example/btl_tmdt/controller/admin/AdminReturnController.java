package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.OrderDao;
import com.example.btl_tmdt.dao.ReturnOrderDao;
import com.example.btl_tmdt.service.OrderService;
import com.example.btl_tmdt.service.ReturnOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/return")
public class AdminReturnController {
    @Autowired
    private ReturnOrderService returnOrderService;
    @Autowired
    private OrderService orderService;

    @GetMapping("/list")
    public ResponseEntity<?> getAllReturnOrders() {
        return ResponseEntity.ok(Map.of(
                "returnOrders", returnOrderService.getAllReturnOrders()
        ));
    }
    @PostMapping("/accept/{id}")
    public ResponseEntity<?> acceptReturnOrder(@PathVariable("id") String id) {
        ReturnOrderDao returnOrder = returnOrderService.getReturnOrderById(id);
        if (returnOrder == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy yêu cầu trả hàng cho đơn hàng ID: " + id));
        }
        OrderDao orderToReturn = orderService.getOrderById(returnOrder.getOrderId()).toDao();
        if (orderToReturn == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy đơn hàng với ID: " + id));
        }
        if ("returned".equalsIgnoreCase(orderToReturn.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Đơn hàng đã được xử lý trả trước đó."));
        }

        orderToReturn.setStatus("returned");
        returnOrder.setStatus("accepted");
        orderService.updateOrder(orderToReturn);
        returnOrderService.updateReturnOrder(returnOrder);

        return ResponseEntity.ok(Map.of(
                "message", "Chấp nhận trả hàng thành công",
                "orderId", id,
                "orderStatus", orderToReturn.getStatus()
        ));

    }

}
