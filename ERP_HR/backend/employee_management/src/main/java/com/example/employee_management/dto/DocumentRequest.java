package com.example.employee_management.dto;

import lombok.Data;

@Data
public class DocumentRequest {
    private String name;
    private String category;
    private String description;
    private Long employeeId;
}