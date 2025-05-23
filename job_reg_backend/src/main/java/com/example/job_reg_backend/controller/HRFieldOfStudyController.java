package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRFieldOfStudy;
import com.example.job_reg_backend.repository.HRFieldOfStudyRepository;
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