package com.example.employee_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HrLuAddressTypeDTO {
    private Long id;
    private String addressType;
    private String description;
}