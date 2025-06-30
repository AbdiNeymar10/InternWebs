package com.example.employee_management.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class CostSharingDTO {
    private Long id;
    private String employeeId;

    @NotNull(message = "Total amount is required")
    private Double totalAmount;

    @NotNull(message = "Amount paid is required")
    private Double amountPaid;

    private String remark;
    private Integer status;
}