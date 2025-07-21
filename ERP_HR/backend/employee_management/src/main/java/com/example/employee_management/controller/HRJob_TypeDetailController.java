package com.example.employee_management.controller;

import com.example.employee_management.entity.HRJob_TypeDetail;
import com.example.employee_management.service.HRJob_TypeDetailService;
import com.example.employee_management.service.HRJob_TypeService;
import com.example.employee_management.service.HR_LuIcfService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-type-details")
@CrossOrigin(origins = "http://localhost:3000")
public class HRJob_TypeDetailController {

    private final HRJob_TypeDetailService jobTypeDetailService;
    private final HRJob_TypeService jobTypeService;
    private final HR_LuIcfService icfService;

    public HRJob_TypeDetailController(HRJob_TypeDetailService jobTypeDetailService, HRJob_TypeService jobTypeService,
            HR_LuIcfService icfService) {
        this.jobTypeDetailService = jobTypeDetailService;
        this.jobTypeService = jobTypeService;
        this.icfService = icfService;
    }

    // Fetch all job type details
    @GetMapping
    public ResponseEntity<List<HRJob_TypeDetail>> getAll() {
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

    @GetMapping("/distinct-icf-values")
    public ResponseEntity<List<String>> getDistinctIcfValues() {
        return ResponseEntity.ok(jobTypeDetailService.findDistinctIcfValues());
    }

    @GetMapping("/icfs-by-job-type-id")
    public ResponseEntity<List<String>> getIcfsByJobTypeId(@RequestParam Long jobTypeId) {
        try {
            List<String> icfs = jobTypeDetailService.findIcfValuesByJobTypeId(jobTypeId);
            return ResponseEntity.ok(icfs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of("Error fetching ICF values: " + e.getMessage()));
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getByJobTitleAndClass(
            @RequestParam String jobTitle,
            @RequestParam String jobClass) {
        try {
            List<HRJob_TypeDetail> details = jobTypeDetailService.findByJobTitleAndClass(jobTitle, jobClass);
            if (details.isEmpty()) {
                return ResponseEntity.ok(details);
            }
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data: " + e.getMessage());
        }
    }

    // Create a new job type detail
    @PostMapping("/save")
    public ResponseEntity<?> saveJobTypeDetails(@RequestBody List<HRJob_TypeDetail> jobTypeDetails) {
        try {
            for (HRJob_TypeDetail detail : jobTypeDetails) {

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

                Long jobTypeId = detail.getJobType().getId();
                detail.setJobType(jobTypeService.findById(jobTypeId));

                Long icfId = detail.getIcf().getId();
                detail.setIcf(icfService.findById(icfId));
            }

            List<HRJob_TypeDetail> savedDetails = jobTypeDetailService.saveAll(jobTypeDetails);
            return ResponseEntity.ok(savedDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid data: " + e.getMessage());
        }
    }

    // Update an existing job type detail
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody HRJob_TypeDetail jobTypeDetail) {
        try {
            HRJob_TypeDetail existingJobTypeDetail = jobTypeDetailService.findById(id);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            jobTypeDetailService.deleteById(id);
            return ResponseEntity.ok("Job type detail deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/by-job-type/{jobTypeId}")
    public ResponseEntity<List<HRJob_TypeDetail>> getByJobTypeId(@PathVariable Long jobTypeId) {
        return ResponseEntity.ok(jobTypeDetailService.findByJobTypeId(jobTypeId));
    }
}