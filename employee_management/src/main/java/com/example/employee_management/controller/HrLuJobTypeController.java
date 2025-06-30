package com.example.employee_management.controller;
import com.example.employee_management.entity.HrLuJobType;
import com.example.employee_management.service.HrLuJobTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lu-job-types")
public class HrLuJobTypeController {

    private final HrLuJobTypeService jobTypeService;

    @Autowired
    public HrLuJobTypeController(HrLuJobTypeService jobTypeService) {
        this.jobTypeService = jobTypeService;
    }

    @GetMapping
    public ResponseEntity<List<HrLuJobType>> getAllJobTypes() {
        return ResponseEntity.ok(jobTypeService.getAllJobTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuJobType> getJobTypeById(@PathVariable Integer id) {
        return jobTypeService.getJobTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HrLuJobType> createJobType(@RequestBody HrLuJobType jobType) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobTypeService.createJobType(jobType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuJobType> updateJobType(
            @PathVariable Integer id, @RequestBody HrLuJobType jobTypeDetails) {
        return ResponseEntity.ok(jobTypeService.updateJobType(id, jobTypeDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobType(@PathVariable Integer id) {
        jobTypeService.deleteJobType(id);
        return ResponseEntity.noContent().build();
    }
}
