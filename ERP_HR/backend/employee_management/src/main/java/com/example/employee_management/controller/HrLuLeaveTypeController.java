package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.service.HrLuLeaveTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-types")
public class HrLuLeaveTypeController {

    private final HrLuLeaveTypeService service;

    @Autowired
    public HrLuLeaveTypeController(HrLuLeaveTypeService service) {
        this.service = service;
    }

    @GetMapping
    public List<HrLuLeaveType> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuLeaveType> getById(@PathVariable Long id) {
        Optional<HrLuLeaveType> leaveType = service.findById(id);
        return leaveType.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public HrLuLeaveType create(@RequestBody HrLuLeaveType leaveType) {
        return service.save(leaveType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuLeaveType> update(@PathVariable Long id, @RequestBody HrLuLeaveType leaveType) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        leaveType.setId(id);
        return ResponseEntity.ok(service.save(leaveType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}