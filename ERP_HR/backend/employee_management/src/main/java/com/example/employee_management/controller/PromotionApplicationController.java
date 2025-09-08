package com.example.employee_management.controller;

import com.example.employee_management.entity.PromotionApplication;
import com.example.employee_management.service.PromotionApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotion-applications")
public class PromotionApplicationController {

    @Autowired
    private PromotionApplicationService promotionApplicationService;

    @GetMapping
    public List<PromotionApplication> getAllApplications() {
        return promotionApplicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionApplication> getApplicationById(@PathVariable Long id) {
        return promotionApplicationService.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PromotionApplication createApplication(@RequestBody PromotionApplication application) {
        return promotionApplicationService.createApplication(application);
    }

    @PutMapping("/{id}")
    public PromotionApplication updateApplication(@PathVariable Long id, @RequestBody PromotionApplication applicationDetails) {
        return promotionApplicationService.updateApplication(id, applicationDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        promotionApplicationService.deleteApplication(id);
        return ResponseEntity.ok().build();
    }
}