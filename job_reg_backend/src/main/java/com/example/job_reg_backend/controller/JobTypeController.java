package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.JobType;
import com.example.job_reg_backend.service.JobTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobtypes")
@CrossOrigin(origins = "http://localhost:3000")
public class JobTypeController {

    @Autowired
    private JobTypeService jobTypeService;

    // Fetch all job types
    @GetMapping
    public ResponseEntity<List<JobType>> getAllJobTypes() {
        List<JobType> jobTypes = jobTypeService.getAllJobTypes();
        return ResponseEntity.ok(jobTypes);
    }

    // Fetch job type by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobTypeById(@PathVariable Long id) {
        try {
            JobType jobType = jobTypeService.getJobTypeById(id);
            return ResponseEntity.ok(jobType);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Job Type not found with ID: " + id);
        }
    }

    // Create a new job type
@PostMapping
public ResponseEntity<?> createJobType(@RequestBody JobType jobType) {
    try {
        System.out.println("Received payload: " + jobType.toString());
        if (jobType.getId() != null) {
            return ResponseEntity.badRequest().body("ID should not be provided when creating a new job type.");
        }
        JobType savedJobType = jobTypeService.saveJobType(jobType);
        return ResponseEntity.ok(savedJobType);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error saving job type: " + e.getMessage());
    }
}

    // Update an existing job type
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJobType(@PathVariable Long id, @RequestBody JobType jobType) {
        try {
            JobType updatedJobType = jobTypeService.updateJobType(id, jobType);
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