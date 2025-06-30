package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuResponsibility;
import com.example.employee_management.service.HrLuResponsibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/responsibilities")
@CrossOrigin(origins = "http://localhost:3000")
public class HrLuResponsibilityController {

    private final HrLuResponsibilityService service;

    @Autowired
    public HrLuResponsibilityController(HrLuResponsibilityService service) {
        this.service = service;
    }

    @PostMapping
    public HrLuResponsibility createResponsibility(@RequestBody HrLuResponsibility responsibility) {
        return service.createResponsibility(responsibility);
    }

    @GetMapping
    public List<HrLuResponsibility> getAllResponsibilities() {
        return service.getAllResponsibilities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuResponsibility> getResponsibilityById(@PathVariable Long id) {
        Optional<HrLuResponsibility> responsibility = service.getResponsibilityById(id);
        return responsibility.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuResponsibility> updateResponsibility(
            @PathVariable Long id, @RequestBody HrLuResponsibility updatedResponsibility) {
        HrLuResponsibility responsibility = service.updateResponsibility(id, updatedResponsibility);
        return ResponseEntity.ok(responsibility);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResponsibility(@PathVariable Long id) {
        service.deleteResponsibility(id);
        return ResponseEntity.noContent().build();
    }
}
