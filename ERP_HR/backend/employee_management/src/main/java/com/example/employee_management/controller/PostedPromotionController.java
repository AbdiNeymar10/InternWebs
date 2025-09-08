package com.example.employee_management.controller;

import com.example.employee_management.entity.PostedPromotion;
import com.example.employee_management.service.PostedPromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posted-promotions")
public class PostedPromotionController {

    @Autowired
    private PostedPromotionService postedPromotionService;

    @GetMapping
    public List<PostedPromotion> getAllPostedPromotions() {
        return postedPromotionService.getAllPostedPromotions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostedPromotion> getPostedPromotionById(@PathVariable String id) {
        return postedPromotionService.getPostedPromotionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PostedPromotion createPostedPromotion(@RequestBody PostedPromotion postedPromotion) {
        return postedPromotionService.createPostedPromotion(postedPromotion);
    }

    @PutMapping("/{id}")
    public PostedPromotion updatePostedPromotion(@PathVariable String id, @RequestBody PostedPromotion postedPromotionDetails) {
        return postedPromotionService.updatePostedPromotion(id, postedPromotionDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePostedPromotion(@PathVariable String id) {
        postedPromotionService.deletePostedPromotion(id);
        return ResponseEntity.ok().build();
    }
}