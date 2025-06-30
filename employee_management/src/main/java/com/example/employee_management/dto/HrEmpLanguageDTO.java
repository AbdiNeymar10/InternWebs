package com.example.employee_management.dto;

import lombok.Data;

@Data
public class HrEmpLanguageDTO {
    private Long id;
    private Long languageTypeId; // Changed from languageType to languageTypeId
    private String languageName; // Added to show language name in responses
    private String reading;
    private String writing;
    private String speaking;
    private String listening;
    private String empId;
}