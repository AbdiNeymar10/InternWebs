package com.example.employee_management.controller;

import com.example.employee_management.entity.Job_Type;
import com.example.employee_management.service.Job_TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job_types")
@CrossOrigin(origins = "http://localhost:3000")
public class Job_TypeController {

    @Autowired
    private Job_TypeService jobTypeService;

    // Fetch all job types
    @GetMapping
    public ResponseEntity<List<Job_Type>> getAllJobTypes() {
        List<Job_Type> jobTypes = jobTypeService.getAllJobTypes();
        return ResponseEntity.ok(jobTypes);
    }

    // Fetch job type by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobTypeById(@PathVariable Long id) {
        try {
            Job_Type jobType = jobTypeService.getJobTypeById(id);
            return ResponseEntity.ok(jobType);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Job Type not found with ID: " + id);
        }
    }

    // Create a new job type
    @GetMapping("/job-titles")
    public ResponseEntity<List<Map<String, Object>>> getJobTitlesWithIds() {
        try {
            List<Job_Type> jobTypes = jobTypeService.getAllJobTypes();
            List<Map<String, Object>> jobTitles = jobTypes.stream()
                    .map(jobType -> Map.<String, Object>of(
                            "id", jobType.getId(),
                            "jobTitle", jobType.getJobTitle() != null ? jobType.getJobTitle() : ""))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(jobTitles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createJobType(@RequestBody Job_Type jobType) {
        try {
            System.out.println("Received payload: " + jobType.toString());
            if (jobType.getId() != null) {
                return ResponseEntity.badRequest().body("ID should not be provided when creating a new job type.");
            }
            Job_Type savedJobType = jobTypeService.saveJobType(jobType);
            return ResponseEntity.ok(savedJobType);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving job type: " + e.getMessage());
        }
    }

    // Update an existing job type
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobType(@PathVariable Long id, @RequestBody Job_Type jobType) {
        try {
            Job_Type updatedJobType = jobTypeService.updateJobType(id, jobType);
            return ResponseEntity.ok(updatedJobType);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error updating Job Type: " + e.getMessage());
        }
    }

    // Delete a job type by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobType(@PathVariable Long id) {
        try {
            jobTypeService.deleteJobType(id);
            return ResponseEntity.ok("Job Type deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error deleting Job Type: " + e.getMessage());
        }
    }
}