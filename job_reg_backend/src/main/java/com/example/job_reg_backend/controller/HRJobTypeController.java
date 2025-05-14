package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.service.HRJobTypeService;
import com.example.job_reg_backend.service.JobFamilyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/api/hr-job-types")
@CrossOrigin(origins = "http://localhost:3000")
public class HRJobTypeController {

    private final HRJobTypeService service; // Declare HRJobTypeService
    private final JobFamilyService jobFamilyService; // Declare JobFamilyService

    // Constructor for dependency injection
    public HRJobTypeController(HRJobTypeService service, JobFamilyService jobFamilyService) {
        this.service = service;
        this.jobFamilyService = jobFamilyService;
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

    // Update job family
    @PutMapping("/update-job-family")
    public ResponseEntity<?> updateJobFamily(@RequestBody List<Map<String, Long>> jobTypeUpdates) {
        try {
            for (Map<String, Long> update : jobTypeUpdates) {
                Long jobTitleId = update.get("jobTitleId");
                Long jobFamilyId = update.get("jobFamilyId");

                // Find the HRJobType by jobTitleId
                List<HRJobType> jobTypes = service.findByJobTitleIds(List.of(jobTitleId));
                if (jobTypes.isEmpty()) {
                    return ResponseEntity.status(404).body("Job Type not found for Job Title ID: " + jobTitleId);
                }

                // Update the JOB_FAMILY column
                HRJobType jobType = jobTypes.get(0);
                jobType.setJobFamily(jobFamilyId);
                service.save(jobType);
            }

            return ResponseEntity.ok("Job Family updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating Job Family: " + e.getMessage());
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

    // Fetch jobFamily, jobCode, and jobGrade by job title ID
    @GetMapping("/details-by-job-title-id")
    public ResponseEntity<?> getDetailsByJobTitleIds(@RequestParam Long jobTitleId) {
        try {
            // Fetch the HRJobType using the jobTitleId
            List<HRJobType> jobTypes = service.findByJobTitleIds(List.of(jobTitleId));
            if (jobTypes.isEmpty()) {
                return ResponseEntity.status(404).body("No job type found for the given job title ID.");
            }

            // Ensure the correct HRJobType is fetched
            HRJobType jobType = jobTypes.stream()
                .filter(jt -> jt.getJobTitle().getId().equals(jobTitleId))
                .findFirst()
                .orElse(jobTypes.get(0)); // Fallback to the first jobType if no exact match is found

            // Fetch the JobFamily name using the jobFamilyId
            Long jobFamilyId = jobType.getJobFamily();
            String jobFamilyName = "N/A";
            if (jobFamilyId != null) {
                jobFamilyName = jobFamilyService.getJobFamilyById(jobFamilyId).getFamilyName();
            }

            // Prepare the response with the correct jobTypeId
            Map<String, Object> jobDetails = new HashMap<>();
            jobDetails.put("jobTypeId", jobType.getId());
            jobDetails.put("jobCode", jobType.getJobCode());
            jobDetails.put("jobTitle", jobType.getJobTitle().getJobTitle());
            jobDetails.put("jobFamily", jobFamilyName); // Include the JobFamily name in the response
            jobDetails.put("jobGrade", jobType.getJobGrade() != null ? jobType.getJobGrade().getGrade() : "N/A");

            return ResponseEntity.ok(jobDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching job details: " + e.getMessage());
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