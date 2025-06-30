package com.example.employee_management.dto;

import lombok.Data;

@Data
public class ExperienceDTO {
    private Long id;
    // Removed version field as per corrected Experience entity
    private String employeeId;
    private String jobTitle;
    private String jobTitleInAmharic;
    private String refNo;
    private String startDateEC;
    private String endDateEC;
    private String startDateGC;
}