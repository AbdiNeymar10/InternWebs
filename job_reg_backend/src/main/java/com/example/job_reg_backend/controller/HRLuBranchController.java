package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HrLuBranch;
import com.example.job_reg_backend.service.HRLuBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/api/hr-lu-branch")
public class HRLuBranchController {

    @Autowired
    private HRLuBranchService service;

    @GetMapping
    public List<HrLuBranch> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<HrLuBranch> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HrLuBranch create(@RequestBody HrLuBranch branch) {
        return service.save(branch);
    }

    @PutMapping("/{id}")
    public HrLuBranch update(@PathVariable Long id, @RequestBody HrLuBranch branch) {
        branch.setId(id);
        return service.save(branch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}