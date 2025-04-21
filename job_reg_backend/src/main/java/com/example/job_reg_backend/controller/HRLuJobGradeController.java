package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRLuJobGrade;
import com.example.job_reg_backend.service.HRLuJobGradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-grades")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from the frontend
public class HRLuJobGradeController {

    private final HRLuJobGradeService service;

    public HRLuJobGradeController(HRLuJobGradeService service) {
        this.service = service;
    }

    // Fetch all job grades
    @GetMapping
    public ResponseEntity<List<HRLuJobGrade>> getAll() {
        try {
            List<HRLuJobGrade> jobGrades = service.findAll();
            return ResponseEntity.ok(jobGrades);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Fetch job grade by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            HRLuJobGrade jobGrade = service.findById(id);
            return ResponseEntity.ok(jobGrade);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching job grade: " + e.getMessage());
        }
    }

    // Create a new job grade
    @PostMapping
    public ResponseEntity<?> create(@RequestBody HRLuJobGrade jobGrade) {
        try {
            if (jobGrade.getId() != null) {
                return ResponseEntity.badRequest().body("ID should not be provided when creating a new job grade.");
            }
            // Allow grade and description to be optional
            HRLuJobGrade savedJobGrade = service.save(jobGrade);
            return ResponseEntity.ok(savedJobGrade);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving job grade: " + e.getMessage());
        }
    }

    // Update an existing job grade
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody HRLuJobGrade jobGrade) {
        try {
            HRLuJobGrade existingJobGrade = service.findById(id);
            existingJobGrade.setGrade(jobGrade.getGrade());
            existingJobGrade.setDescription(jobGrade.getDescription());
            HRLuJobGrade updatedJobGrade = service.save(existingJobGrade);
            return ResponseEntity.ok(updatedJobGrade);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating job grade: " + e.getMessage());
        }
    }

    // Delete a job grade by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok("Job grade deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting job grade: " + e.getMessage());
        }
    }
}