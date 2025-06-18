package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRPromotionHistory;
import com.example.job_reg_backend.service.HRPromotionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController

@RequestMapping("/api/promotion-history")
@CrossOrigin(origins = "http://localhost:3000")
public class HRPromotionHistoryController {

    @Autowired
    private HRPromotionHistoryService service;

    @GetMapping
    public List<HRPromotionHistory> getAllPromotionHistories() {
        return service.getAllPromotionHistories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HRPromotionHistory> getPromotionHistoryById(@PathVariable Long id) {
        Optional<HRPromotionHistory> promotionHistory = service.getPromotionHistoryById(id);
        return promotionHistory.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public HRPromotionHistory createPromotionHistory(@RequestBody HRPromotionHistory promotionHistory) {
        if (promotionHistory.getJobTitleChanged() == null) {
            promotionHistory.setJobTitleChanged(0);
        }
        return service.savePromotionHistory(promotionHistory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HRPromotionHistory> updatePromotionHistory(
            @PathVariable Long id,
            @RequestBody HRPromotionHistory promotionHistory) {
        Optional<HRPromotionHistory> existing = service.getPromotionHistoryById(id);
        if (existing.isPresent()) {
            promotionHistory.setPromotionHistoryId(id);
            if (promotionHistory.getJobTitleChanged() == null) {
                promotionHistory.setJobTitleChanged(0);
            }
            return ResponseEntity.ok(service.savePromotionHistory(promotionHistory));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotionHistory(@PathVariable Long id) {
        if (service.getPromotionHistoryById(id).isPresent()) {
            service.deletePromotionHistory(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}