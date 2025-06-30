package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuNation;
import com.example.employee_management.service.HrLuNationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nations")
public class HrLuNationController {

    private final HrLuNationService nationService;

    public HrLuNationController(HrLuNationService nationService) {
        this.nationService = nationService;
    }

    @GetMapping
    public List<HrLuNation> getAllNations() {
        return nationService.getAllNations();
    }

    @GetMapping("/{nationCode}")
    public ResponseEntity<HrLuNation> getNationById(@PathVariable Integer nationCode) {
        return ResponseEntity.ok(nationService.getNationById(nationCode));
    }

    @PostMapping
    public HrLuNation createNation(@RequestBody HrLuNation nation) {
        return nationService.createNation(nation);
    }

    @PutMapping("/{nationCode}")
    public ResponseEntity<HrLuNation> updateNation(
            @PathVariable Integer nationCode,
            @RequestBody HrLuNation nationDetails) {
        return ResponseEntity.ok(nationService.updateNation(nationCode, nationDetails));
    }

    @DeleteMapping("/{nationCode}")
    public ResponseEntity<?> deleteNation(@PathVariable Integer nationCode) {
        nationService.deleteNation(nationCode);
        return ResponseEntity.noContent().build();
    }
}
