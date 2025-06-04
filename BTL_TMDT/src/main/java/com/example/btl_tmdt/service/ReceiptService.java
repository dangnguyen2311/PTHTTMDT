package com.example.btl_tmdt.service;

import com.example.btl_tmdt.model.Receipt;
import com.example.btl_tmdt.repository.ReceiptRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReceiptService {
    @Autowired
    private ReceiptRepo receiptRepo;

    public void saveReceipt(Receipt receipt) {
        receiptRepo.save(receipt);
    }
}
