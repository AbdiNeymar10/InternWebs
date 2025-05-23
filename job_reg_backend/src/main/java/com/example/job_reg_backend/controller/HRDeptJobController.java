package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRDeptJob;
import com.example.job_reg_backend.model.Department;
import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.service.HRDeptJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-dept-jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class HRDeptJobController {

    @Autowired
    private HRDeptJobService hrDeptJobService;

    @GetMapping
    public List<HRDeptJob> getAllDeptJobs() {
        return hrDeptJobService.getAllDeptJobs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HRDeptJob> getDeptJobById(@PathVariable Long id) {
        Optional<HRDeptJob> deptJob = hrDeptJobService.getDeptJobById(id);
        return deptJob.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/by-department/{departmentId}")
public ResponseEntity<List<HRDeptJob>> getJobsByDepartment(@PathVariable Long departmentId) {
    List<HRDeptJob> jobs = hrDeptJobService.getJobsByDepartmentId(departmentId);
    return ResponseEntity.ok(jobs);
}

    @PostMapping
    public HRDeptJob createDeptJob(@RequestBody HRDeptJob hrDeptJob) {
        return hrDeptJobService.saveDeptJob(hrDeptJob);
    }

 @PostMapping("/bulk")
public ResponseEntity<?> saveDeptJobs(@RequestBody List<Map<String, Object>> deptJobs) {
    try {
        for (Map<String, Object> deptJob : deptJobs) {
            // Validate departmentId
            if (deptJob.get("departmentId") == null || !(deptJob.get("departmentId") instanceof Number)) {
                return ResponseEntity.badRequest().body("Invalid departmentId: must be a number and cannot be null.");
            }

            // Validate jobTypeId
            
            if (deptJob.get("jobTypeId") == null || !(deptJob.get("jobTypeId") instanceof Number)) {
                return ResponseEntity.badRequest().body("Invalid jobTypeId: must be a number and cannot be null.");
            }

            Long departmentId = ((Number) deptJob.get("departmentId")).longValue();
            Long jobTypeId = ((Number) deptJob.get("jobTypeId")).longValue();
            Integer noOfEmployees = ((Number) deptJob.get("noOfEmployees")).intValue();

            HRDeptJob newDeptJob = new HRDeptJob();

            // Set department and job type
            Department department = new Department();
            department.setDeptId(departmentId);
            newDeptJob.setDepartment(department);

            HRJobType jobType = new HRJobType();
            jobType.setId(jobTypeId);
            newDeptJob.setJobType(jobType);

            newDeptJob.setNoOfEmployees(noOfEmployees);

            hrDeptJobService.saveDeptJob(newDeptJob);
        }
        return ResponseEntity.ok("Jobs successfully saved to the department.");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error saving jobs: " + e.getMessage());
    }
}

    @PutMapping("/{id}")
    public ResponseEntity<HRDeptJob> updateDeptJob(@PathVariable Long id, @RequestBody HRDeptJob hrDeptJob) {
        if (!hrDeptJobService.getDeptJobById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        hrDeptJob.setId(id);
        return ResponseEntity.ok(hrDeptJobService.saveDeptJob(hrDeptJob));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeptJob(@PathVariable Long id) {
        if (!hrDeptJobService.getDeptJobById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        hrDeptJobService.deleteDeptJob(id);
        return ResponseEntity.noContent().build();
    }
}