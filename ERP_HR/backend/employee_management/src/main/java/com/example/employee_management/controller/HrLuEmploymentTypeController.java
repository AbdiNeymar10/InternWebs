package com.example.employee_management.controller;
import com.example.employee_management.entity.HrLuEmploymentType;
import com.example.employee_management.service.HrLuEmploymentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employment-types")
public class HrLuEmploymentTypeController {

    private final HrLuEmploymentTypeService employmentTypeService;

    @Autowired
    public HrLuEmploymentTypeController(HrLuEmploymentTypeService employmentTypeService) {
        this.employmentTypeService = employmentTypeService;
    }

    @GetMapping
    public ResponseEntity<List<HrLuEmploymentType>> getAllEmploymentTypes() {
        return ResponseEntity.ok(employmentTypeService.getAllEmploymentTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuEmploymentType> getEmploymentTypeById(@PathVariable Integer id) {
        return employmentTypeService.getEmploymentTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HrLuEmploymentType> createEmploymentType(@RequestBody HrLuEmploymentType employmentType) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employmentTypeService.createEmploymentType(employmentType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuEmploymentType> updateEmploymentType(
            @PathVariable Integer id, @RequestBody HrLuEmploymentType employmentTypeDetails) {
        return ResponseEntity.ok(employmentTypeService.updateEmploymentType(id, employmentTypeDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmploymentType(@PathVariable Integer id) {
        employmentTypeService.deleteEmploymentType(id);
        return ResponseEntity.noContent().build();
    }
}