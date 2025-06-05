package com.example.btl_tmdt.dao;

import com.example.btl_tmdt.model.InteractionLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InteractionLogDao {
    private String id;
    private String userId;
    private String productId;
    private String interactionType;
    private Integer rating;
    private Date timestamp;

    public InteractionLog toModel() {
        return new InteractionLog(id, userId, productId, interactionType, rating, timestamp);
    }
}