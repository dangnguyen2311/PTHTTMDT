package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.dao.CategoryDao;
import com.example.btl_tmdt.dao.OrderDao;
import com.example.btl_tmdt.dao.ProductInOrderDao;
import com.example.btl_tmdt.model.Category;
import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.ProductInOrder;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.OrderService;
import com.example.btl_tmdt.service.ProductInOrderService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/order")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private ProductInOrderService productInOrderService;
    @Autowired
    private UserService userService;


    @GetMapping("/detail/{orderId}")
    public ResponseEntity<?> orderDetail(HttpSession session, @PathVariable("orderId") String orderId) {
        User user = userService.getUserByUserName((String) session.getAttribute("userName"));
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Order order = orderService.getOrderById(orderId);

        List<ProductInOrderDao> productInOrderDaos = productInOrderService.getByOrder(order)
                .stream().map(ProductInOrder::toDao).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "orderDao", order.toDao(),
                "productInOrderDaos", productInOrderDaos
        ));
    }
}
