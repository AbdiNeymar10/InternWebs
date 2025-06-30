package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuJobFamily;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.service.HrLuJobFamilyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-families")
@CrossOrigin(origins = "http://localhost:3000")
public class HrLuJobFamilyController {

    private final HrLuJobFamilyService service;

    @Autowired
    public HrLuJobFamilyController(HrLuJobFamilyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<HrLuJobFamily> create(@Valid @RequestBody HrLuJobFamily jobFamily) {
        HrLuJobFamily createdJobFamily = service.create(jobFamily);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobFamily);
    }

    @GetMapping
    public ResponseEntity<List<HrLuJobFamily>> findAll() {
        List<HrLuJobFamily> jobFamilies = service.findAll();
        return ResponseEntity.ok(jobFamilies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuJobFamily> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Job Family not found with id: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuJobFamily> update(
            @PathVariable Integer id,
            @Valid @RequestBody HrLuJobFamily jobFamily) {
        return service.findById(id)
                .map(existing -> {
                    jobFamily.setId(id);
                    HrLuJobFamily updated = service.update(jobFamily);
                    return ResponseEntity.ok(updated);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Job Family not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return service.findById(id)
                .map(jobFamily -> {
                    service.delete(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseThrow(() -> new ResourceNotFoundException("Job Family not found with id: " + id));
    }
}