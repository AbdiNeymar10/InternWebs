package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuJobGrade;
import com.example.employee_management.service.HrLuJobGradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-grades")
@CrossOrigin(origins = "http://localhost:3000")

public class HrLuJobGradeController {

    private final HrLuJobGradeService hrLuJobGradeService;

    @Autowired
    public HrLuJobGradeController(HrLuJobGradeService hrLuJobGradeService) {
        this.hrLuJobGradeService = hrLuJobGradeService;
    }

    // Fetch all job grades
    @GetMapping
    public List<HrLuJobGrade> getAllJobGrades() {
        return hrLuJobGradeService.findAll();
    }

    // Fetch job grade by ID
    @GetMapping("/{id}")
    public ResponseEntity<HrLuJobGrade> getJobGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(hrLuJobGradeService.findById(id));
    }

    // Create a new job grade
    @PostMapping
    public ResponseEntity<HrLuJobGrade> createJobGrade(@RequestBody HrLuJobGrade hrLuJobGrade) {
        return ResponseEntity.ok(hrLuJobGradeService.save(hrLuJobGrade));
    }

    // Update an existing job grade
    @PutMapping("/{id}")
    public ResponseEntity<HrLuJobGrade> updateJobGrade(@PathVariable Long id, @RequestBody HrLuJobGrade hrLuJobGrade) {
        hrLuJobGrade.setId(id);
        return ResponseEntity.ok(hrLuJobGradeService.save(hrLuJobGrade));
    }

    // Delete a job grade by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobGrade(@PathVariable Long id) {
        hrLuJobGradeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}