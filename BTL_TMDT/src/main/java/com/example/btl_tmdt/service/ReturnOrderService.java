package com.example.btl_tmdt.service;

import com.example.btl_tmdt.dao.ReturnOrderDao;
import com.example.btl_tmdt.model.ReturnOrder;
import com.example.btl_tmdt.repository.ReturnOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReturnOrderService {
    @Autowired
    private ReturnOrderRepo returnOrderRepo;

    public void saveReturnOrder(ReturnOrderDao returnOrderDao) {
        returnOrderRepo.save(returnOrderDao.toModel());
    }

}
