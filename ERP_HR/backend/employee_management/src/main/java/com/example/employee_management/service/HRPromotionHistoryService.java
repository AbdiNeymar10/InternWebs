package com.example.employee_management.service;

import com.example.employee_management.entity.HRPromotionHistory;
import com.example.employee_management.repository.HRPromotionHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRPromotionHistoryService {

    @Autowired
    private HRPromotionHistoryRepository repository;

    public List<HRPromotionHistory> getAllPromotionHistories() {
        return repository.findAll();
    }

    public Optional<HRPromotionHistory> getPromotionHistoryById(Long id) {
        return repository.findById(id);
    }

    public HRPromotionHistory savePromotionHistory(HRPromotionHistory promotionHistory) {
        return repository.save(promotionHistory);
    }

    public void deletePromotionHistory(Long id) {
        repository.deleteById(id);
    }
}