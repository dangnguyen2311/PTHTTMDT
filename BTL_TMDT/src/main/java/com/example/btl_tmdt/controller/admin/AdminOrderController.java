package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.OrderDao;
import com.example.btl_tmdt.dao.ProductInOrderDao;
import com.example.btl_tmdt.dao.UserDao;
import com.example.btl_tmdt.model.Order;
import com.example.btl_tmdt.model.ProductInOrder;
import com.example.btl_tmdt.model.User;
import com.example.btl_tmdt.service.OrderService;
import com.example.btl_tmdt.service.ProductInOrderService;
import com.example.btl_tmdt.service.ProductService;
import com.example.btl_tmdt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/order")
public class AdminOrderController {
    @Autowired
    UserService userService;

    @Autowired
    ProductService productService;

    @Autowired
    ProductInOrderService productInOrderService;

    @Autowired
    OrderService orderService;

    @Autowired
    HttpSession session;

    public boolean checkUser(){
        User user = (User) userService.getUserByUserName((String) session.getAttribute("userName"));
        return user.getUserRole().equals("2");
//        return true;
    }

    @GetMapping("")
    public ResponseEntity<?> getOrders() {
//        if (!checkUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }
        List<OrderDao> orderDaoList = orderService.getOrders();
        return ResponseEntity.ok(orderDaoList);
    }

    // Lấy chi tiết các sản phẩm trong một order
    @GetMapping("/order-item/{id}")
    public ResponseEntity<?> getProductInOrder(@PathVariable("id") String id) {
//        if (!checkUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }

        Order order = orderService.getOrderById(id);
        System.out.println("Admin see Order: "+order.getOrderId() + " = id = " + id +", status: " + order.getStatus() + ",nums = " + productInOrderService.getProductInOrderByOrderId(id).size());

        List<ProductInOrderDao> productInOrderDaos = productInOrderService.getProductInOrder(order)
                .stream().map(ProductInOrder::toDao).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("order", order.toDao());
        response.put("items", productInOrderDaos);

        return ResponseEntity.ok(response);
    }

    // Xoá một order
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable("id") String id) {
//        if (!checkUser()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//        }

        Order order = orderService.getOrderById(id);

        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
        System.out.println("Order to delete: " + order);
        productInOrderService.deleteOrder(order);
        return ResponseEntity.ok("Order deleted successfully");
    }

}
