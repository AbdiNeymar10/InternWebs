package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRJobTypeDetail;
import com.example.job_reg_backend.service.HRJobTypeDetailService;
import com.example.job_reg_backend.service.HRJobTypeService;
import com.example.job_reg_backend.service.HRLuIcfService;
import org.springframework.http.HttpStatus; // Add this import
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-type-details")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from the frontend
public class HRJobTypeDetailController {

    private final HRJobTypeDetailService jobTypeDetailService;
    private final HRJobTypeService jobTypeService;
    private final HRLuIcfService icfService;

    public HRJobTypeDetailController(HRJobTypeDetailService jobTypeDetailService, HRJobTypeService jobTypeService, HRLuIcfService icfService) {
        this.jobTypeDetailService = jobTypeDetailService;
        this.jobTypeService = jobTypeService;
        this.icfService = icfService;
    }

    // Fetch all job type details
    @GetMapping
    public ResponseEntity<List<HRJobTypeDetail>> getAll() {
        return ResponseEntity.ok(jobTypeDetailService.findAll());
    }

    // Fetch job type detail by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobTypeDetailService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Create a new job type detail
@PostMapping("/save")
public ResponseEntity<?> saveJobTypeDetails(@RequestBody List<HRJobTypeDetail> jobTypeDetails) {
    try {
        for (HRJobTypeDetail detail : jobTypeDetails) {
            
            // 🛑 Basic validation
            if (detail.getJobType() == null || detail.getJobType().getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Job Type is missing or invalid.");
            }

            if (!jobTypeService.existsById(detail.getJobType().getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid jobType ID: " + detail.getJobType().getId());
            }

            if (detail.getIcf() == null || detail.getIcf().getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ICF is missing or invalid.");
            }

            if (!icfService.existsById(detail.getIcf().getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid ICF ID: " + detail.getIcf().getId());
            }

            // ✅ Fetch and attach fully loaded jobType and ICF entities
            Long jobTypeId = detail.getJobType().getId();
            detail.setJobType(jobTypeService.findById(jobTypeId));

            Long icfId = detail.getIcf().getId();
            detail.setIcf(icfService.findById(icfId));
        }

        // 🚀 Save after all validations
        List<HRJobTypeDetail> savedDetails = jobTypeDetailService.saveAll(jobTypeDetails);
        return ResponseEntity.ok(savedDetails);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Invalid data: " + e.getMessage());
    }
}

    // Update an existing job type detail
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody HRJobTypeDetail jobTypeDetail) {
        try {
            HRJobTypeDetail existingJobTypeDetail = jobTypeDetailService.findById(id);
            existingJobTypeDetail.setPositionCode(jobTypeDetail.getPositionCode());
            existingJobTypeDetail.setRemark(jobTypeDetail.getRemark());
            existingJobTypeDetail.setStatus(jobTypeDetail.getStatus());
            existingJobTypeDetail.setIcf(jobTypeDetail.getIcf());
            existingJobTypeDetail.setJobType(jobTypeDetail.getJobType());
            return ResponseEntity.ok(jobTypeDetailService.save(existingJobTypeDetail));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating job type detail: " + e.getMessage());
        }
    }

    // Delete a job type detail by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            jobTypeDetailService.deleteById(id);
            return ResponseEntity.ok("Job type detail deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}