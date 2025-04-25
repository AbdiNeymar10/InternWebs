package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRLuIcf;
import com.example.job_reg_backend.service.HRLuIcfService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/icf")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend
public class HRLuIcfController {

    private final HRLuIcfService service;

    public HRLuIcfController(HRLuIcfService service) {
        this.service = service;
    }

    @GetMapping
    public List<HRLuIcf> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public HRLuIcf getById(@PathVariable Long id) {
        return service.findById(id);
    }

@PostMapping
public HRLuIcf create(@RequestBody HRLuIcf entity) {
   
    try {
        HRLuIcf savedEntity = service.save(entity);
        return savedEntity;
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error saving ICF: " + e.getMessage());
    }
}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}