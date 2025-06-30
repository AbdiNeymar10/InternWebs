package com.example.employee_management.controller;
import com.example.employee_management.entity.HrLuReligion;
import com.example.employee_management.service.HrLuReligionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/religions")
public class HrLuReligionController {

    private final HrLuReligionService religionService;

    @Autowired
    public HrLuReligionController(HrLuReligionService religionService) {
        this.religionService = religionService;
    }

    @GetMapping
    public ResponseEntity<List<HrLuReligion>> getAllReligions() {
        return ResponseEntity.ok(religionService.getAllReligions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuReligion> getReligionById(@PathVariable Long id) {
        return religionService.getReligionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HrLuReligion> createReligion(@RequestBody HrLuReligion religion) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(religionService.createReligion(religion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuReligion> updateReligion(
            @PathVariable Long id, @RequestBody HrLuReligion religionDetails) {
        return ResponseEntity.ok(religionService.updateReligion(id, religionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReligion(@PathVariable Long id) {
        religionService.deleteReligion(id);
        return ResponseEntity.noContent().build();
    }
}
