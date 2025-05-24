package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRLuBranch;
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
    public List<HRLuBranch> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<HRLuBranch> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HRLuBranch create(@RequestBody HRLuBranch branch) {
        return service.save(branch);
    }

    @PutMapping("/{id}")
    public HRLuBranch update(@PathVariable Long id, @RequestBody HRLuBranch branch) {
        branch.setId(id);
        return service.save(branch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}