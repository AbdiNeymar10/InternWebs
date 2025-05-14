package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.FieldOfStudy;
import com.example.job_reg_backend.service.FieldOfStudyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields-of-study")
@CrossOrigin(origins = "http://localhost:3000")
public class FieldOfStudyController {

    private final FieldOfStudyService service;

    public FieldOfStudyController(FieldOfStudyService service) {
        this.service = service;
    }

    // Fetch all fields of study
    @GetMapping
    public ResponseEntity<List<FieldOfStudy>> getAllFieldsOfStudy() {
        return ResponseEntity.ok(service.findAll());
    }

    // Fetch a field of study by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFieldOfStudyById(@PathVariable Long id) {
        FieldOfStudy fieldOfStudy = service.findById(id);
        if (fieldOfStudy == null) {
            return ResponseEntity.status(404).body("Field of Study not found with ID: " + id);
        }
        return ResponseEntity.ok(fieldOfStudy);
    }

    // Create or update a field of study
    @PostMapping
    public ResponseEntity<FieldOfStudy> createOrUpdateFieldOfStudy(@RequestBody FieldOfStudy fieldOfStudy) {
        return ResponseEntity.ok(service.save(fieldOfStudy));
    }

    // Delete a field of study by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFieldOfStudy(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Field of Study deleted successfully.");
    }
}