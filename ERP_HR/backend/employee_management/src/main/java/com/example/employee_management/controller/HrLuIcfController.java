package com.example.employee_management.controller;
import com.example.employee_management.entity.HrLuIcf;
import com.example.employee_management.service.HrLuIcfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/icfs")
public class HrLuIcfController {

    private final HrLuIcfService icfService;

    @Autowired
    public HrLuIcfController(HrLuIcfService icfService) {
        this.icfService = icfService;
    }

    @GetMapping
    public ResponseEntity<List<HrLuIcf>> getAllIcfs() {
        return ResponseEntity.ok(icfService.getAllIcfs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuIcf> getIcfById(@PathVariable Long id) {
        return icfService.getIcfById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HrLuIcf> createIcf(@RequestBody HrLuIcf icf) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(icfService.createIcf(icf));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuIcf> updateIcf(
            @PathVariable Long id, @RequestBody HrLuIcf icfDetails) {
        return ResponseEntity.ok(icfService.updateIcf(id, icfDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIcf(@PathVariable Long id) {
        icfService.deleteIcf(id);
        return ResponseEntity.noContent().build();
    }
}
