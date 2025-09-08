package com.example.employee_management.dto;

import lombok.Data;

@Data
public class CreateFullPromotionRequest {

    // --- Fields for HR_POSTED_PROMOTION ---
    private Long vacancyTypeId; // CHANGED: from String to Long ID
    private String startDate;
    private String deadline;
    private String description;
    private String commentGiven;
    private String preparedBy;

    // --- Fields for HR_PROMOTION_POST ---
    private Long recruitmentRequestId;
    private String forEmployee;
    private String additionalExperience;
    private String postCode;
}