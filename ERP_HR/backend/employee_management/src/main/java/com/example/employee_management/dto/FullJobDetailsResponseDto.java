package com.example.employee_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FullJobDetailsResponseDto {
    private String icf;
    private String departmentName;
    private String vacancyCode; // Corresponds to RECRUIT_BATCH_CODE
    private Long numberOfEmployees; // Corresponds to NUM_OF_EMPS
}