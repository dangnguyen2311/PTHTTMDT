package com.example.btl_tmdt.controller.admin;

import com.example.btl_tmdt.dao.OrderDao;
import com.example.btl_tmdt.dao.ProductDao;
import com.example.btl_tmdt.dao.ProductInOrderDao;
import com.example.btl_tmdt.dao.ReturnOrderDao;
import com.example.btl_tmdt.model.Product;
import com.example.btl_tmdt.model.ProductInOrder;
import com.example.btl_tmdt.service.OrderService;
import com.example.btl_tmdt.service.ProductInOrderService;
import com.example.btl_tmdt.service.ProductService;
import com.example.btl_tmdt.service.ReturnOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/statistic")
public class AdminStatisticController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private ReturnOrderService returnOrderService;
    @Autowired
    private ProductInOrderService productInOrderService;
    @Autowired
    private ProductService productService;

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueStats(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate)
    {
        List<OrderDao> orders = orderService.getOrdersByDateRange(startDate, endDate);
        Double totalRevenue = orders.stream()
                .mapToDouble(OrderDao::getTotal)
                .sum();
        int totalOrders = orders.size();
        System.out.println("Thong ke doanh thu: totalOrders = " + totalOrders + ", totalRevenue = " + totalRevenue);



        return ResponseEntity.ok(Map.of(
                "totalOrders", totalOrders,
                "totalRevenue", totalRevenue,
                "orders", orders
        ));

    }

    @GetMapping("/return")
    public ResponseEntity<?> getReturnStats(@RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate){
        List<ReturnOrderDao> returnOrders = returnOrderService.getReturnOrdersByDateRange(startDate, endDate);
        int totalReturnOrders = returnOrders.size();

        System.out.println("Thong ke tra hang: totalReturnOrders = " + totalReturnOrders);
        return ResponseEntity.ok(Map.of(
                "totalReturnOrders", totalReturnOrders,
                "returnOrders", returnOrders
        ));
    }

    @GetMapping("/best-selling")
    public ResponseEntity<?> getBestSellingProducts(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<OrderDao> orders = orderService.getOrdersByDateRange(startDate, endDate);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Thong ke ban chay: totalOrders = " + orders.size());

        List<ProductInOrderDao> productInOrders = new ArrayList<>();
        for (OrderDao order : orders) {
            List<ProductInOrder> productsInOrder = productInOrderService
                    .getProductInOrderByOrderId(order.getOrderId());
            System.out.println("SOs San pham trong don ban chay = " + productsInOrder.size() + "id: " + order.getOrderId());
            for(ProductInOrder productInOrder : productsInOrder) {
                productInOrders.add(productInOrder.toDao());
            }
        }

        // Thống kê số lượng bán theo prodId
        Map<String, Long> productSalesCount = productInOrders.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getProductDao().getProdId(),
                        Collectors.summingLong(ProductInOrderDao::getQuantity)
                ));

        // Chuẩn bị kết quả: danh sách sản phẩm và số lượng đã bán
        List<Map<String, Object>> bestSelling = new ArrayList<>();

        for (Map.Entry<String, Long> entry : productSalesCount.entrySet()) {
            String productId = entry.getKey();
            Long soldQuantity = entry.getValue();

            ProductDao productDao = productInOrders.stream()
                    .filter(p -> p.getProductDao().getProdId().equals(productId))
                    .findFirst()
                    .map(ProductInOrderDao::getProductDao)
                    .orElse(null);

            if (productDao != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("prodId", productId);
                item.put("prodName", productDao.getProdName());
                item.put("prodPrice", productDao.getProdPrice());
                item.put("soldQuantity", soldQuantity);
                bestSelling.add(item);
            }
        }

        if (bestSelling.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Sắp xếp giảm dần theo soldQuantity
        bestSelling.sort((a, b) -> Long.compare((Long) b.get("soldQuantity"), (Long) a.get("soldQuantity")));

        return ResponseEntity.ok(bestSelling);
    }



}
