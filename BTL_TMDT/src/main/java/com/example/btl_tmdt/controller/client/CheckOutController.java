package com.example.btl_tmdt.controller.client;

import com.example.btl_tmdt.model.*;
import com.example.btl_tmdt.service.*;
import com.example.btl_tmdt.dao.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/checkout")
public class CheckOutController {

    @Autowired
    OrderService orderService;

    @Autowired
    ProductService productService;

    @Autowired
    UserService userService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    ProductInCartService productInCartService;

    @Autowired
    ProductInOrderService productInOrderService;

    @Autowired
    CartService cartService;

    @GetMapping("/get-checkout")
    public ResponseEntity<?> getCheckout(HttpSession session) {
        User user = userService.getUserByUserName((String) session.getAttribute("userName"));
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Cart cart = cartService.getCartByUser(user);
        List<ProductInCartDao> productInCartDaos = productInCartService.getProductInCart(cart)
                .stream().map(ProductInCart::toDao).collect(Collectors.toList());

        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream().map(Category::toDao).collect(Collectors.toList());

        List<ProductDao> productDaos = productService.getProducts()
                .stream().map(Product::toDao).collect(Collectors.toList());

        Collections.shuffle(productDaos);

        Double totalPrice = Double.valueOf(productInCartDaos.stream()
                .map(e -> e.getQuantity() * e.getProductDao().getProdPrice())
                .reduce(0.0F, Float::sum));

        return ResponseEntity.ok(Map.of(
                "categoryDaos", categoryDaos,
                "productDaos", productDaos,
                "userDao", user.toDao(),
                "cartDao", cart.toDao(),
                "cartItemDaos", productInCartDaos,
                "totalPrice", totalPrice
        ));
    }

    @PostMapping("/order")
    public ResponseEntity<?> createNewOrder(HttpSession session, @RequestBody OrderDao orderDao) {
        User user = userService.getUserByUserName((String) session.getAttribute("userName"));
        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Cart cart = cartService.getCartByUser(user);
        List<ProductInCart> productInCarts = productInCartService.getProductInCart(cart);

        Double totalPrice = Double.valueOf(productInCarts.stream()
                .map(e -> e.getQuantity() * e.getProduct().getProdPrice())
                .reduce(0.0F, Float::sum));

        orderDao.setUserDao(user.toDao());
        orderDao.setOrder_time(new Date());
        orderDao.setTotal(totalPrice + 50000.0);

        Order order = orderService.createOrder(orderDao.toModel());

        for (ProductInCart i : productInCarts) {
            ProductInOrder productInOrder = new ProductInOrder(order, i.getProduct(), i.getQuantity());
            productInOrderService.createProductInOrder(productInOrder);
            productInCartService.deleteProductInCart(i);
        }

        List<ProductInOrderDao> productInOrderDaos = productInOrderService.getByOrder(order)
                .stream().map(ProductInOrder::toDao).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "orderDao", order.toDao(),
                "productInOrderDaos", productInOrderDaos
        ));
    }

    @GetMapping("/my-order")
    public ResponseEntity<?> listOrder(HttpSession session) {
        User user = userService.getUserByUserName((String) session.getAttribute("userName"));
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream().map(Category::toDao).collect(Collectors.toList());

        List<OrderDao> orderDaos = orderService.getListOrderOfUser(user)
                .stream().map(Order::toDao)
                .sorted(Comparator.comparing(OrderDao::getOrder_time).reversed())
                .toList();

        return ResponseEntity.ok(Map.of(
                "categoryDaos", categoryDaos,
                "orderDaos", orderDaos
        ));
    }

    @GetMapping("/my-order/detail/{orderId}")
    public ResponseEntity<?> orderDetail(HttpSession session, @PathVariable("orderId") String orderId) {
        User user = userService.getUserByUserName((String) session.getAttribute("userName"));
        if (user == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Order order = orderService.getOrderById(orderId);

        List<CategoryDao> categoryDaos = categoryService.getCategories()
                .stream().map(Category::toDao).collect(Collectors.toList());

        List<ProductInOrderDao> productInOrderDaos = productInOrderService.getByOrder(order)
                .stream().map(ProductInOrder::toDao).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "categoryDaos", categoryDaos,
                "orderDao", order.toDao(),
                "productInOrderDaos", productInOrderDaos
        ));
    }
}
