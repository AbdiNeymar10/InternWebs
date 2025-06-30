package com.example.employee_management.controller;

import com.example.employee_management.entity.Education;
import com.example.employee_management.service.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees/{empId}/education")
@CrossOrigin(origins = "http://localhost:3000")
public class EducationController {

    @Autowired
    private EducationService educationService;

    @GetMapping
    public List<Education> getEducationsByEmployee(@PathVariable String empId) {
        return educationService.getEducationsByEmployee(empId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Education> getEducationById(@PathVariable String empId, @PathVariable Long id) {
        Education education = educationService.getById(id);
        return ResponseEntity.ok(education);
    }

    @PostMapping
    public ResponseEntity<Education> createEducation(@PathVariable String empId, @RequestBody Education education) {
        Education created = educationService.createEducationForEmployee(empId, education);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> updateEducation(@PathVariable String empId, @PathVariable Long id, @RequestBody Education updated) {
        Education education = educationService.update(id, updated);
        return ResponseEntity.ok(education);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable String empId, @PathVariable Long id) {
        educationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}