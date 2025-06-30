package com.example.employee_management.controller;

import com.example.employee_management.dto.CostSharingDTO;
import com.example.employee_management.service.CostSharingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/employees/{empId}/cost-sharings")
public class CostSharingController {

    @Autowired
    private CostSharingService costSharingService;

    @GetMapping
    public ResponseEntity<List<CostSharingDTO>> getCostSharingsByEmployeeId(@PathVariable String empId) {
        List<CostSharingDTO> costSharings = costSharingService.getCostSharingsByEmployeeId(empId);
        return ResponseEntity.ok(costSharings);
    }

    @PostMapping
    public ResponseEntity<?> createCostSharing(
            @PathVariable String empId,
            @Valid @RequestBody CostSharingDTO costSharingDTO) {
        try {
            CostSharingDTO createdCostSharing = costSharingService.createCostSharing(empId, costSharingDTO);
            return ResponseEntity.ok(createdCostSharing);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCostSharing(
            @PathVariable String empId,
            @PathVariable Long id,
            @Valid @RequestBody CostSharingDTO costSharingDTO) {
        try {
            CostSharingDTO updatedCostSharing = costSharingService.updateCostSharing(id, costSharingDTO);
            return ResponseEntity.ok(updatedCostSharing);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCostSharing(
            @PathVariable String empId,
            @PathVariable Long id) {
        costSharingService.deleteCostSharing(id);
        return ResponseEntity.noContent().build();
    }
}