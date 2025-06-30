package com.example.employee_management.controller;

import com.example.employee_management.dto.JobTypeDTO;
import com.example.employee_management.service.JobTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobtypes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobTypeController {
    private final JobTypeService jobTypeService;

    @GetMapping
    public ResponseEntity<?> getAllJobTypes() {
        try {
            List<JobTypeDTO> jobTypes = jobTypeService.getAllJobTypes();
            return ResponseEntity.ok(jobTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error fetching job types: " + e.getMessage()));
        }
    }

    @GetMapping("/titles-for-dropdown")
    public ResponseEntity<?> getJobTypesForDropdown() {
        try {
            List<JobTypeDTO> jobTypes = jobTypeService.getAllJobTypes();
            return ResponseEntity.ok(jobTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error fetching job types: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createJobType(@RequestBody JobTypeDTO jobTypeDTO) {
        try {
            if (jobTypeDTO.getId() != null) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "ID should not be provided when creating a new job type."));
            }
            if (jobTypeDTO.getCode() == null || jobTypeDTO.getCode().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Job Type code is required."));
            }
            if (jobTypeDTO.getJobTitle() == null || jobTypeDTO.getJobTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Job Title is required."));
            }

            JobTypeDTO savedJobType = jobTypeService.createJobType(jobTypeDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJobType);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error creating job type: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobTypeById(@PathVariable Long id) {
        try {
            JobTypeDTO jobType = jobTypeService.getJobTypeById(id);
            return ResponseEntity.ok(jobType);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error fetching job type with ID " + id + ": " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobType(@PathVariable Long id, @RequestBody JobTypeDTO jobTypeDTO) {
        try {
            if (jobTypeDTO.getId() != null && !jobTypeDTO.getId().equals(id)) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "ID in path and body do not match."));
            }
            jobTypeDTO.setId(id);
            JobTypeDTO updatedJobType = jobTypeService.updateJobType(id, jobTypeDTO);
            return ResponseEntity.ok(updatedJobType);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error updating job type with ID " + id + ": " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobType(@PathVariable Long id) {
        try {
            jobTypeService.deleteJobType(id);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Job Type with ID " + id + " deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error deleting job type with ID " + id + ": " + e.getMessage()));
        }
    }
}