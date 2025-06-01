package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.ReturnOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReturnOrderDao {
    private String id;
    private String orderId;
    private String userName;
    public String status;
    private String reason;
    private String returnDate;
    private String address;
    private String note;

    public ReturnOrder toModel() {
        return new ReturnOrder(id, orderId, userName, status, reason, returnDate, address, note);
    }

}
