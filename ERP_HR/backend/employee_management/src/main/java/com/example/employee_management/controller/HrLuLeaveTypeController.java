package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.service.HrLuLeaveTypeService;
import jakarta.validation.Valid; // Use jakarta validation
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
public class HrLuLeaveTypeController {

    private final HrLuLeaveTypeService service;

    // Constructor injection is already correctly used - great job!
    public HrLuLeaveTypeController(HrLuLeaveTypeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<HrLuLeaveType>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuLeaveType> getById(@PathVariable Long id) {
        // The service will throw an exception if not found, which is handled globally.
        HrLuLeaveType leaveType = service.findById(id);
        return ResponseEntity.ok(leaveType);
    }

    @PostMapping
    public ResponseEntity<HrLuLeaveType> create(@Valid @RequestBody HrLuLeaveType leaveType) {
        // Ensure the ID is null so the database generates a new one.
        leaveType.setId(null);
        HrLuLeaveType savedLeaveType = service.save(leaveType);

        // Build the location URI of the new resource for the response header.
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedLeaveType.getId())
                .toUri();

        // Return 201 Created status, the location, and the created object.
        return ResponseEntity.created(location).body(savedLeaveType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuLeaveType> update(@PathVariable Long id, @Valid @RequestBody HrLuLeaveType leaveTypeDetails) {
        // The service's update method will handle the "not found" case internally.
        HrLuLeaveType updatedLeaveType = service.update(id, leaveTypeDetails);
        return ResponseEntity.ok(updatedLeaveType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // The service will throw an exception if the ID to delete is not found.
        service.deleteById(id);
        return ResponseEntity.noContent().build(); 
    }
}
