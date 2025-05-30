package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HrLuResponsibility;
import com.example.job_reg_backend.service.HRLuResponsibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/api/hr-lu-responsibility")
public class HRLuResponsibilityController {

    @Autowired
    private HRLuResponsibilityService service;

    @GetMapping
    public List<HrLuResponsibility> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<HrLuResponsibility> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HrLuResponsibility create(@RequestBody HrLuResponsibility responsibility) {
        return service.save(responsibility);
    }

    @PutMapping("/{id}")
    public HrLuResponsibility update(@PathVariable Long id, @RequestBody HrLuResponsibility responsibility) {
        responsibility.setId(id);
        return service.save(responsibility);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}