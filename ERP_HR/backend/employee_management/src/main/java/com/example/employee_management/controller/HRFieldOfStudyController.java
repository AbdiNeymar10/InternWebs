package com.example.employee_management.controller;

import com.example.employee_management.entity.HRFieldOfStudy;
import com.example.employee_management.repository.HRFieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr-field-of-study")
@CrossOrigin(origins = "http://localhost:3000")
public class HRFieldOfStudyController {

    @Autowired
    private HRFieldOfStudyRepository repository;

    @GetMapping
    public List<HRFieldOfStudy> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public HRFieldOfStudy create(@RequestBody HRFieldOfStudy entity) {
        return repository.save(entity);
    }
    @PostMapping("/bulk")
    public List<HRFieldOfStudy> createBulk(@RequestBody List<HRFieldOfStudy> entities) {
        return repository.saveAll(entities);
}
}