package com.example.employee_management.controller;

import com.example.employee_management.entity.FieldOfStudy;
import com.example.employee_management.service.FieldOfStudyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/field-of-study")
@CrossOrigin(origins = "http://localhost:3000")
public class FieldOfStudyController {

    @Autowired
    private FieldOfStudyService fieldOfStudyService;

    @GetMapping
    public List<FieldOfStudy> getAll() {
        return fieldOfStudyService.getAll();
    }
}