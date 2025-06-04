package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.OrderDao;
import com.example.btl_tmdt.dao.ReturnOrderDao;
import com.example.btl_tmdt.model.ReturnOrder;
import com.example.btl_tmdt.repository.ReturnOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class ReturnOrderService {
    @Autowired
    private ReturnOrderRepo returnOrderRepo;

    public void saveReturnOrder(ReturnOrderDao returnOrderDao) {
        returnOrderRepo.save(returnOrderDao.toModel());
    }
    public List<ReturnOrderDao> getAllReturnOrders() {
//        return Optional.ofNullable(returnOrderRepo.findAll());
        return returnOrderRepo.findAll().stream().map(ReturnOrder::toDao).toList();
    }

    public ReturnOrderDao getReturnOrderByOrderId(String id) {
        return returnOrderRepo.getReturnOrderByOrderId(id);
    }

    public void updateReturnOrder(ReturnOrderDao returnOrder) {
        Optional<ReturnOrder> existingReturnOrder = returnOrderRepo.findById(returnOrder.getId());
        if (existingReturnOrder.isPresent()) {
            ReturnOrder updatedReturnOrder = existingReturnOrder.get();
            updatedReturnOrder.setStatus(returnOrder.getStatus());
            updatedReturnOrder.setReason(returnOrder.getReason());
            returnOrderRepo.save(updatedReturnOrder);
        } else {
            throw new RuntimeException("Return order not found with id: " + returnOrder.getId());
        }
    }

    public ReturnOrderDao getReturnOrderById(String id) {
        return returnOrderRepo.getReturnOrderById(id).toDao();
    }

    public List<ReturnOrderDao> getReturnOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        return returnOrderRepo.findAll().stream()
                .filter(returnOrder -> {
                    try {
                        // Chuyển đổi String -> LocalDate
                        LocalDate returnDate = Instant.parse(returnOrder.getReturnDate())
                                .atZone(ZoneId.of("UTC")) // hoặc systemDefault()
                                .toLocalDate();
                        return !returnDate.isBefore(startDate) && !returnDate.isAfter(endDate);
                    } catch (Exception e) {
                        // Nếu lỗi parse, loại bỏ bản ghi này
                        return false;
                    }
                })
                .map(ReturnOrder::toDao)
                .toList();
    }
}
