package com.example.employee_management.dto;

import lombok.Data;

@Data
public class JobDetailsDto {
    private String jobCode;
    private String jobTitle;
    private String jobFamily;
    private String jobGrade;
    private String jobFamilyCode;
    private String jobGradeDescription;
}