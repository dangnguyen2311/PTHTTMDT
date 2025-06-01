package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.OrderDao;
import com.example.btl_tmdt.dao.ReturnOrderDao;
import com.example.btl_tmdt.model.ReturnOrder;
import com.example.btl_tmdt.service.OrderService;
import com.example.btl_tmdt.service.ReturnOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/return")
public class ReturnController {
    @Autowired
    private ReturnOrderService returnOrderService;
    @Autowired
    private OrderService orderService;


    @PostMapping("/{id}")
    public ResponseEntity<?> getReturnOrder(
            @PathVariable("id") String id,
            @RequestBody ReturnOrder returnOrder
    ) {
        // Update order status to "returned" and save return order
        OrderDao orderDaotoReturn = orderService.getOrderById(id).toDao();
        System.out.println("Order to be returned: " + orderDaotoReturn);
        if (orderDaotoReturn == null) {
            return ResponseEntity.badRequest().body("Order not found with ID: " + id);
        }

        orderDaotoReturn.setStatus("wait");
        orderService.updateOrder(orderDaotoReturn);
        returnOrderService.saveReturnOrder(returnOrder.toDao());
        return ResponseEntity.ok(Map.of("message", "Return order will be process"));
    }


}
