package com.example.employee_management.controller;


import com.example.employee_management.entity.HrLuSeparationType;
import com.example.employee_management.service.HrLuSeparationTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/separation-types")
public class HrLuSeparationTypeController {
    @Autowired
    private HrLuSeparationTypeService separationTypeService;

    @GetMapping
    public List<HrLuSeparationType> getAllSeparationTypes() {
        return separationTypeService.getAllSeparationTypes();
    }
}
