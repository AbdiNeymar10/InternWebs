package com.example.employee_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HrPayGradeDto {
    private Long payGradeId;
    private String salary;
    private String stepNo;
    private Long rankId;
}