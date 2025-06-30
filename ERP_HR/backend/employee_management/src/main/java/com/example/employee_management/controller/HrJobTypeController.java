package com.example.employee_management.controller;

import com.example.employee_management.dto.JobDetailsDto;
import com.example.employee_management.entity.HrJobType;
import com.example.employee_management.service.HrJobTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-types")
public class HrJobTypeController {

    private final HrJobTypeService hrJobTypeService;

    @Autowired
    public HrJobTypeController(HrJobTypeService hrJobTypeService) {
        this.hrJobTypeService = hrJobTypeService;
    }

    @GetMapping
    public List<HrJobType> getAllJobTypes() {
        return hrJobTypeService.getAllJobTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrJobType> getJobTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(hrJobTypeService.getJobTypeById(id));
    }

    @GetMapping("/by-job-title/{jobTitleId}")
    public ResponseEntity<JobDetailsDto> getJobDetailsByJobTitle(@PathVariable Integer jobTitleId) {
        return ResponseEntity.ok(hrJobTypeService.getJobDetailsByJobTitleId(jobTitleId));
    }

    @PostMapping
    public ResponseEntity<HrJobType> createJobType(@RequestBody HrJobType hrJobType) {
        return ResponseEntity.ok(hrJobTypeService.createJobType(hrJobType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrJobType> updateJobType(@PathVariable Long id, @RequestBody HrJobType hrJobTypeDetails) {
        return ResponseEntity.ok(hrJobTypeService.updateJobType(id, hrJobTypeDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobType(@PathVariable Long id) {
        hrJobTypeService.deleteJobType(id);
        return ResponseEntity.noContent().build();
    }
}