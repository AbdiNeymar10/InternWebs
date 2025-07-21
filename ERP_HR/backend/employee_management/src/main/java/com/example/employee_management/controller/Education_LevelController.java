package com.example.employee_management.controller;

import com.example.employee_management.entity.Education_Level;
import com.example.employee_management.service.Education_LevelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/education-levels")
@CrossOrigin(origins = "http://localhost:3000")
public class Education_LevelController {

    private final Education_LevelService service;

    public Education_LevelController(Education_LevelService service) {
        this.service = service;
    }

    // Fetch all education level records
    @GetMapping
    public ResponseEntity<List<Education_Level>> getAllEducationLevels() {
        return ResponseEntity.ok(service.findAll());
    }

    // Fetch education level by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEducationLevelById(@PathVariable Long id) {
        Education_Level educationLevel = service.findById(id);
        if (educationLevel == null) {
            return ResponseEntity.status(404).body("Education level not found with ID: " + id);
        }
        return ResponseEntity.ok(educationLevel);
    }

    @GetMapping("/education-categories")
    public ResponseEntity<List<String>> getEducationCategories() {
        List<String> categories = service.findAll()
                .stream()
                .map(Education_Level::getCatagory)
                .distinct()
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/education-level")
    public ResponseEntity<List<Education_Level>> getEducationLevels() {
        List<Education_Level> educationLevels = service.findAll()
                .stream()
                .map(level -> new Education_Level(level.getId(), level.getCatagory(), level.getEduName(),
                        level.getRank(), level.getEduLevel(), level.getCategory()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(educationLevels);
    }

    // Create or update an education level record
    @PostMapping
    public ResponseEntity<Education_Level> createOrUpdateEducationLevel(@RequestBody Education_Level educationLevel) {
        return ResponseEntity.ok(service.save(educationLevel));
    }

    // Delete an education level record by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEducationLevel(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok("Education level deleted successfully.");
    }
}