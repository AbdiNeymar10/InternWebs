package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuPositionName;
import com.example.employee_management.service.HrLuPositionNameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/position-names")
public class HrLuPositionNameController {

    private final HrLuPositionNameService positionNameService;

    @Autowired
    public HrLuPositionNameController(HrLuPositionNameService positionNameService) {
        this.positionNameService = positionNameService;
    }

    @GetMapping
    public ResponseEntity<List<HrLuPositionName>> getAllPositionNames() {
        return ResponseEntity.ok(positionNameService.getAllPositions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuPositionName> getPositionNameById(@PathVariable Long id) {
        return ResponseEntity.ok(positionNameService.getPositionById(id));
    }

    @PostMapping
    public ResponseEntity<HrLuPositionName> createPositionName(@RequestBody HrLuPositionName positionName) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(positionNameService.createPosition(positionName));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuPositionName> updatePositionName(
            @PathVariable Long id, @RequestBody HrLuPositionName positionNameDetails) {
        return ResponseEntity.ok(positionNameService.updatePosition(id, positionNameDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePositionName(@PathVariable Long id) {
        positionNameService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }
}