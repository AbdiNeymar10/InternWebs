package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRLuResponsibility;
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
    public List<HRLuResponsibility> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<HRLuResponsibility> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HRLuResponsibility create(@RequestBody HRLuResponsibility responsibility) {
        return service.save(responsibility);
    }

    @PutMapping("/{id}")
    public HRLuResponsibility update(@PathVariable Long id, @RequestBody HRLuResponsibility responsibility) {
        responsibility.setId(id);
        return service.save(responsibility);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}