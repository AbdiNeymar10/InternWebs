package com.example.employee_management.controller;

import com.example.employee_management.entity.VacancyType;
import com.example.employee_management.service.VacancyTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacancy-types")
public class VacancyTypeController {

    private final VacancyTypeService vacancyTypeService;

    @Autowired
    public VacancyTypeController(VacancyTypeService vacancyTypeService) {
        this.vacancyTypeService = vacancyTypeService;
    }

    @GetMapping
    public List<VacancyType> getAllVacancyTypes() {
        return vacancyTypeService.getAllVacancyTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacancyType> getVacancyTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(vacancyTypeService.getVacancyTypeById(id));
    }

    @PostMapping
    public VacancyType createVacancyType(@RequestBody VacancyType vacancyType) {
        return vacancyTypeService.createVacancyType(vacancyType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacancyType> updateVacancyType(@PathVariable Long id, @RequestBody VacancyType vacancyTypeDetails) {
        return ResponseEntity.ok(vacancyTypeService.updateVacancyType(id, vacancyTypeDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVacancyType(@PathVariable Long id) {
        vacancyTypeService.deleteVacancyType(id);
        return ResponseEntity.ok().build();
    }
}