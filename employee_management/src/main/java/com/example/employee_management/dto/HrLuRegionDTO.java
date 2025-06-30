package com.example.employee_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrLuRegionDTO {
    private Long id;
    private String regionName;
    private String description;
}