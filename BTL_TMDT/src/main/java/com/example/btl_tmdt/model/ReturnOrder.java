package com.example.btl_tmdt.model;

import com.example.btl_tmdt.dao.ReturnOrderDao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "return_order")
public class ReturnOrder {
    @Id
    private String id;
    private String orderId;
    private String userName;
    public String status;
    private String reason;
    private String returnDate;
    private String address;
    private String note;

    public ReturnOrder(String orderId, String userName, String status, String reason, String returnDate, String address, String note) {
        this.orderId = orderId;
        this.userName = userName;
        this.status = status;
        this.reason = reason;
        this.returnDate = returnDate;
        this.address = address;
        this.note = note;

    }
    public ReturnOrderDao toDao() {
        return new ReturnOrderDao(id, orderId, userName, status, reason, returnDate, address, note);
    }

}
