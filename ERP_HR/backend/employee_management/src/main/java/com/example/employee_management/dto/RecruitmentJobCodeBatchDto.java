package com.example.employee_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentJobCodeBatchDto {
    private String jobCodeAndBatchCode;
    private Integer jobTitleId; // <--- CHANGE THIS FROM Long TO Integer
}