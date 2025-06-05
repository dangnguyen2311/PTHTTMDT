package com.example.btl_tmdt.service;

import com.example.btl_tmdt.model.InteractionLog;
import com.example.btl_tmdt.repository.InteractionLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class InteractionLogService {

    @Autowired
    private InteractionLogRepository interactionLogRepository;

    public InteractionLog createInteractionLog(String userId, String productId, String interactionType, Integer rating) {
        // Find if an interaction of the same type (e.g., VIEW) already exists recently
        // For 'VIEW', you might want to update timestamp or avoid duplicate logs within a short period
        // For 'PURCHASE' or 'ADD_TO_CART' or 'REVIEW', usually create new distinct log

        InteractionLog newLog = new InteractionLog(userId, productId, interactionType, rating, new Date());
        return interactionLogRepository.save(newLog);
    }

    public List<InteractionLog> getAllInteractionLogs() {
        return interactionLogRepository.findAll();
    }

    public List<InteractionLog> getInteractionLogsByUserId(String userId) {
        return interactionLogRepository.findByUserId(userId);
    }

    // You might want to update an existing interaction (e.g., change review rating)
    public InteractionLog updateInteractionLog(InteractionLog log) {
        return interactionLogRepository.save(log);
    }
}