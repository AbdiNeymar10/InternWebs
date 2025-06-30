package com.example.employee_management.controller;

import com.example.employee_management.entity.FieldOf_Study;
import com.example.employee_management.service.FieldOf_StudyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields-of-study")
@CrossOrigin(origins = "http://localhost:3000")
public class FieldOf_StudyController {

    private final FieldOf_StudyService service;

    public FieldOf_StudyController(FieldOf_StudyService service) {
        this.service = service;
    }

    // Fetch all fields of study
    @GetMapping
    public ResponseEntity<List<FieldOf_Study>> getAllFieldsOfStudy() {
        return ResponseEntity.ok(service.findAll());
    }

    // Fetch a field of study by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFieldOfStudyById(@PathVariable Long id) {
        FieldOf_Study fieldOfStudy = service.findById(id);
        if (fieldOfStudy == null) {
            return ResponseEntity.status(404).body("Field of Study not found with ID: " + id);
        }
        return ResponseEntity.ok(fieldOfStudy);
    }

    // Create or update a field of study
    @PostMapping
    public ResponseEntity<FieldOf_Study> createOrUpdateFieldOfStudy(@RequestBody FieldOf_Study fieldOfStudy) {
        return ResponseEntity.ok(service.save(fieldOfStudy));
    }

    // Delete a field of study by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFieldOfStudy(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Field of Study deleted successfully.");
    }
}