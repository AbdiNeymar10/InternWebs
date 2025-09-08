package com.example.employee_management.controller;

import com.example.employee_management.dto.CreateFullPromotionRequest;
import com.example.employee_management.entity.PromotionPost;
import com.example.employee_management.service.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Renamed for clarity, as it handles the full promotion, not just the post.
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    // Dependency on the correct service that handles the full logic.
    private final PromotionService promotionService;

    // Constructor injection with the correct service.
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    /**
     * Creates a full promotion, including the parent PostedPromotion and the child PromotionPost.
     * @param request The DTO containing all necessary data.
     * @return A ResponseEntity with the newly created PromotionPost and HTTP 201 status.
     */
    @PostMapping
    public ResponseEntity<PromotionPost> createFullPromotion(@RequestBody CreateFullPromotionRequest request) {
        // Calling the correct service method that performs the complete, transactional operation.
        PromotionPost savedPost = promotionService.createFullPromotion(request);

        // Returning 201 Created is the standard for a successful POST request.
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }
}