package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuBranch;
import com.example.employee_management.service.HrLuBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-lu-branch")
@CrossOrigin(origins = "http://localhost:3000")
public class HrLuBranchController {

    private final HrLuBranchService hrLuBranchService;

    @Autowired
    public HrLuBranchController(HrLuBranchService hrLuBranchService) {
        this.hrLuBranchService = hrLuBranchService;
    }

    @PostMapping
    public HrLuBranch createHrLuBranch(@RequestBody HrLuBranch hrLuBranch) {
        return hrLuBranchService.createHrLuBranch(hrLuBranch);
    }

    @GetMapping
    public List<HrLuBranch> getAllHrLuBranches() {
        return hrLuBranchService.getAllHrLuBranches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuBranch> getHrLuBranchById(@PathVariable Long id) {
        Optional<HrLuBranch> hrLuBranch = hrLuBranchService.getHrLuBranchById(id);
        return hrLuBranch.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuBranch> updateHrLuBranch(@PathVariable Long id,
            @RequestBody HrLuBranch updatedHrLuBranch) {
        HrLuBranch result = hrLuBranchService.updateHrLuBranch(id, updatedHrLuBranch);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHrLuBranch(@PathVariable Long id) {
        hrLuBranchService.deleteHrLuBranch(id);
        return ResponseEntity.noContent().build();
    }
}
