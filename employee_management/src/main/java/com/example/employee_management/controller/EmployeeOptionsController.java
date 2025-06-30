package com.example.employee_management.controller;

import com.example.employee_management.dto.EmployeeFormOptions;
import com.example.employee_management.service.EmployeeOptionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee-options")
public class EmployeeOptionsController {

    private final EmployeeOptionsService employeeOptionsService;

    @Autowired
    public EmployeeOptionsController(EmployeeOptionsService employeeOptionsService) {
        this.employeeOptionsService = employeeOptionsService;
    }

    @GetMapping
    public EmployeeFormOptions getAllEmployeeOptions() {
        return employeeOptionsService.getAllOptions();
    }
}