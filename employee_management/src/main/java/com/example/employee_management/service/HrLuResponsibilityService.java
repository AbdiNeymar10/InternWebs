package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuResponsibility;
import com.example.employee_management.repository.HrLuResponsibilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuResponsibilityService {

    private final HrLuResponsibilityRepository repository;

    @Autowired
    public HrLuResponsibilityService(HrLuResponsibilityRepository repository) {
        this.repository = repository;
    }

    // Create
    public HrLuResponsibility createResponsibility(HrLuResponsibility responsibility) {
        return repository.save(responsibility);
    }

    // Read All
    public List<HrLuResponsibility> getAllResponsibilities() {
        return repository.findAll();
    }

    // Read by ID
    public Optional<HrLuResponsibility> getResponsibilityById(Long id) {
        return repository.findById(id);
    }

    // Update
    public HrLuResponsibility updateResponsibility(Long id, HrLuResponsibility updatedResponsibility) {
        return repository.findById(id)
                .map(responsibility -> {
                    responsibility.setResponsibility(updatedResponsibility.getResponsibility());
                    responsibility.setDescription(updatedResponsibility.getDescription());
                    return repository.save(responsibility);
                })
                .orElseGet(() -> {
                    updatedResponsibility.setId(id);
                    return repository.save(updatedResponsibility);
                });
    }

    // Delete
    public void deleteResponsibility(Long id) {
        repository.deleteById(id);
    }
}
