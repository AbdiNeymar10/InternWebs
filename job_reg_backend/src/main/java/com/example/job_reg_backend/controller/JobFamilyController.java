package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.JobFamily;
import com.example.job_reg_backend.service.JobFamilyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-family")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend
public class JobFamilyController {

    @Autowired
    private JobFamilyService jobFamilyService;

    @GetMapping
    public List<JobFamily> getAllJobFamilies() {
        return jobFamilyService.getAllJobFamilies();
    }

    @GetMapping("/{id}")
    public JobFamily getJobFamilyById(@PathVariable Long id) {
        return jobFamilyService.getJobFamilyById(id);
    }

    @PostMapping
    public JobFamily createJobFamily(@RequestBody JobFamily jobFamily) {
        return jobFamilyService.createJobFamily(jobFamily);
    }

    @PutMapping("/{id}")
    public JobFamily updateJobFamily(@PathVariable Long id, @RequestBody JobFamily updatedJobFamily) {
        return jobFamilyService.updateJobFamily(id, updatedJobFamily);
    }

    @DeleteMapping("/{id}")
    public void deleteJobFamily(@PathVariable Long id) {
        jobFamilyService.deleteJobFamily(id);
    }
}