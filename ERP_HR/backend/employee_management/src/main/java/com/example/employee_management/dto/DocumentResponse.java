package com.example.employee_management.dto;

import lombok.Data;

@Data
public class DocumentResponse {
    private Long id;
    private String name;
    private String size;
    private String type;
    private String category;
    private String description;
    private String uploadDate;
    private Long employeeId;
}