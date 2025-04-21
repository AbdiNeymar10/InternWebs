package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.service.HRJobTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList; // Import added

@RestController
@RequestMapping("/api/hr-job-types")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from the frontend
public class HRJobTypeController {

    private final HRJobTypeService service;

    public HRJobTypeController(HRJobTypeService service) {
        this.service = service;
    }

    // Fetch all job types
    @GetMapping
    public ResponseEntity<List<HRJobType>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    // Fetch job type by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Create a new job type or save multiple job types
    @PostMapping("/save-job-types")
    public ResponseEntity<?> saveJobTypes(@RequestBody List<HRJobType> jobTypes) {
        try {
            List<Long> savedJobTypeIds = new ArrayList<>();
            for (HRJobType jobType : jobTypes) {
                // Generate Job Code
                String lastCode = service.getLastJobCode(jobType.getJobTitle().getId());
                String newCode = service.generateJobCode(lastCode, jobType.getJobTitle().getId());
                jobType.setJobCode(newCode);

                // Save Job Type
                HRJobType savedJobType = service.save(jobType);

                // Log the jobTypeId
                System.out.println("Registered Job Type ID: " + savedJobType.getId());
                savedJobTypeIds.add(savedJobType.getId());
            }
            return ResponseEntity.ok(savedJobTypeIds); // Return the list of saved jobTypeIds
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving job types: " + e.getMessage());
        }
    }

    // Update an existing job type
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody HRJobType jobType) {
        try {
            HRJobType existingJobType = service.findById(id);
            existingJobType.setJobCode(jobType.getJobCode());
            existingJobType.setJobStatus(jobType.getJobStatus());
            existingJobType.setRemark(jobType.getRemark());
            existingJobType.setJobTitle(jobType.getJobTitle());
            existingJobType.setJobGrade(jobType.getJobGrade());
            existingJobType.setJobFamily(jobType.getJobFamily());
            return ResponseEntity.ok(service.save(existingJobType));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating job type: " + e.getMessage());
        }
    }

    // Delete a job type by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok("Job type deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}