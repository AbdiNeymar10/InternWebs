package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuIncidentType;
import com.example.employee_management.service.HrLuIncidentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incident-types") // Endpoint for incident types
public class HrLuIncidentTypeController {

    private final HrLuIncidentTypeService service;

    @Autowired
    public HrLuIncidentTypeController(HrLuIncidentTypeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> getAllIncidentTypes() {
        return service.findAll().stream()
                .map(incidentType -> Map.of(
                        "id", (Object)incidentType.getId(),
                        // Key "incidentName" for frontend, value from entity's "incidentType" field
                        "incidentName", (Object)incidentType.getIncidentType()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuIncidentType> getById(@PathVariable Long id) {
        Optional<HrLuIncidentType> incidentType = service.findById(id);
        return incidentType.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public HrLuIncidentType create(@RequestBody HrLuIncidentType incidentType) {
        return service.save(incidentType);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuIncidentType> update(@PathVariable Long id, @RequestBody HrLuIncidentType incidentTypeDetails) {
        return service.findById(id)
                .map(existingType -> {
                    existingType.setIncidentType(incidentTypeDetails.getIncidentType());
                    existingType.setDescription(incidentTypeDetails.getDescription());
                    return ResponseEntity.ok(service.save(existingType));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) { // updated to isEmpty for clarity with Optional
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}