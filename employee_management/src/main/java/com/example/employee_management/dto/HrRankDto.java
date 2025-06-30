package com.example.employee_management.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HrRankDto {
    private Long rankId;
    private String beginningSalary;
    private String maxSalary;
    private Integer jobGradeId;
    private Integer icfId;
}