package com.example.employee_management.controller;

import com.example.employee_management.entity.Institution;
import com.example.employee_management.service.InstitutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/institutions")
@CrossOrigin(origins = "http://localhost:3000")
public class InstitutionController {

    @Autowired
    private InstitutionService institutionService;

    @GetMapping
    public ResponseEntity<List<Institution>> getAllInstitutions() {
        List<Institution> institutions = institutionService.getAllInstitutions();
        return new ResponseEntity<>(institutions, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Institution> getInstitutionById(@PathVariable Long id) {
        Optional<Institution> institution = institutionService.getInstitutionById(id);
        return institution.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Institution> createInstitution(@RequestBody Institution institution) {
        Institution savedInstitution = institutionService.createInstitution(institution);
        return new ResponseEntity<>(savedInstitution, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Institution> updateInstitution(@PathVariable Long id, @RequestBody Institution institution) {
        Institution updatedInstitution = institutionService.updateInstitution(id, institution);
        if (updatedInstitution != null) {
            return new ResponseEntity<>(updatedInstitution, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstitution(@PathVariable Long id) {
        institutionService.deleteInstitution(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}