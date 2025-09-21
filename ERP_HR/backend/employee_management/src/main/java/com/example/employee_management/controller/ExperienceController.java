package com.example.employee_management.controller;

import com.example.employee_management.dto.ExperienceDTO;
import com.example.employee_management.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees/{employeeId}/experience-records") // Changed to match frontend
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Slf4j
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<?> getExperiencesByEmployeeId(@PathVariable String employeeId) {
        try {
            log.info("GET /api/employees/{}/experience-records", employeeId);
            List<ExperienceDTO> experiences = experienceService.getExperiencesByEmployeeId(employeeId);
            return ResponseEntity.ok(experiences);
        } catch (Exception e) {
            log.error("Error fetching experiences for employeeId {}: {}", employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error fetching experiences: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExperienceById(@PathVariable String employeeId, @PathVariable Long id) {
        try {
            log.info("GET /api/employees/{}/experience-records/{}", employeeId, id);
            ExperienceDTO experience = experienceService.getExperienceById(id);
            if (!experience.getEmployeeId().equals(employeeId)) {
                log.warn("Attempt to access experience id {} for wrong employee id {}", id, employeeId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("status", "error", "message", "Experience does not belong to the specified employee."));
            }
            return ResponseEntity.ok(experience);
        } catch (RuntimeException e) {
            log.warn("Experience not found with id {} for employeeId {}: {}", id, employeeId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching experience id {} for employeeId {}: {}", id, employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error fetching experience: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createExperience(
            @PathVariable String employeeId,
            @RequestBody ExperienceDTO experienceDTO) {
        try {
            log.info("POST /api/employees/{}/experience-records with DTO: {}", employeeId, experienceDTO);
            experienceDTO.setEmployeeId(employeeId);
            ExperienceDTO createdExperience = experienceService.createExperience(experienceDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExperience);
        } catch (RuntimeException e) {
            log.error("Error creating experience for employeeId {}: {}", employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating experience for employeeId {}: {}", employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error creating experience: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperience(
            @PathVariable String employeeId,
            @PathVariable Long id,
            @RequestBody ExperienceDTO experienceDTO) {
        try {
            log.info("PUT /api/employees/{}/experience-records/{} with DTO: {}", employeeId, id, experienceDTO);
            experienceDTO.setEmployeeId(employeeId);
            ExperienceDTO updatedExperience = experienceService.updateExperience(id, experienceDTO);
            return ResponseEntity.ok(updatedExperience);
        } catch (RuntimeException e) {
            log.error("Error updating experience id {} for employeeId {}: {}", id, employeeId, e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error updating experience id {} for employeeId {}: {}", id, employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error updating experience: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(
            @PathVariable String employeeId,
            @PathVariable Long id) {
        try {
            log.info("DELETE /api/employees/{}/experience-records/{}", employeeId, id);
            experienceService.deleteExperience(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Error deleting experience id {} for employeeId {}: {}", id, employeeId, e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error deleting experience id {} for employeeId {}: {}", id, employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error deleting experience: " + e.getMessage()));
        }
    }
}