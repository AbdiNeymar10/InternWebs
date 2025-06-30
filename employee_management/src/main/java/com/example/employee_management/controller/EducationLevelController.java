package com.example.employee_management.controller;

import com.example.employee_management.entity.EducationLevel;
import com.example.employee_management.service.EducationLevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/education-level")
@CrossOrigin(origins = "http://localhost:3000")
public class EducationLevelController {

    @Autowired
    private EducationLevelService educationLevelService;

    @GetMapping
    public List<EducationLevel> getAll() {
        return educationLevelService.getAll();
    }
}