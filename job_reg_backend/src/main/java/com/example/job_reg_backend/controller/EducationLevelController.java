package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.EducationLevel;
import com.example.job_reg_backend.service.EducationLevelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/education-levels")
@CrossOrigin(origins = "http://localhost:3000")
public class EducationLevelController {

    private final EducationLevelService service;

    public EducationLevelController(EducationLevelService service) {
        this.service = service;
    }

    // Fetch all education level records
    @GetMapping
    public ResponseEntity<List<EducationLevel>> getAllEducationLevels() {
        return ResponseEntity.ok(service.findAll());
    }

    // Fetch education level by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEducationLevelById(@PathVariable Long id) {
        EducationLevel educationLevel = service.findById(id);
        if (educationLevel == null) {
            return ResponseEntity.status(404).body("Education level not found with ID: " + id);
        }
        return ResponseEntity.ok(educationLevel);
    }
   @GetMapping("/education-categories")
    public ResponseEntity<List<String>> getEducationCategories() {
    List<String> categories = service.findAll() 
        .stream()
        .map(EducationLevel::getCatagory) 
        .distinct()
        .collect(Collectors.toList());
    return ResponseEntity.ok(categories);
}
    @GetMapping("/education-level")
public ResponseEntity<List<EducationLevel>> getEducationLevels() {
    List<EducationLevel> educationLevels = service.findAll()
        .stream()
        .map(level -> new EducationLevel(level.getId(), level.getCatagory(), level.getEduName(), level.getRank(), level.getEduLevel(), level.getCategory()))
        .collect(Collectors.toList());
    return ResponseEntity.ok(educationLevels);
}

    // Create or update an education level record
    @PostMapping
    public ResponseEntity<EducationLevel> createOrUpdateEducationLevel(@RequestBody EducationLevel educationLevel) {
        return ResponseEntity.ok(service.save(educationLevel));
    }

    // Delete an education level record by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEducationLevel(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Education level deleted successfully.");
    }
}