package com.example.employee_management.controller;

import com.example.employee_management.entity.HR_LuIcf;
import com.example.employee_management.service.HR_LuIcfService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/icf")
@CrossOrigin(origins = "http://localhost:3000")
public class HR_LuIcfController {

    private final HR_LuIcfService service;

    public HR_LuIcfController(HR_LuIcfService service) {
        this.service = service;
    }

    @GetMapping
    public List<HR_LuIcf> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public HR_LuIcf getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public HR_LuIcf create(@RequestBody HR_LuIcf entity) {

        try {
            HR_LuIcf savedEntity = service.save(entity);
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