package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.EducationLevel;
import com.example.job_reg_backend.repository.EducationLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationLevelService {

    private final EducationLevelRepository repository;

    public EducationLevelService(EducationLevelRepository repository) {
        this.repository = repository;
    }

    // Fetch all education level records
    public List<EducationLevel> findAll() {
        return repository.findAll();
    }

    // Fetch education level by ID
    public EducationLevel findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Create or update an education level record
    public EducationLevel save(EducationLevel educationLevel) {
        return repository.save(educationLevel);
    }

    // Delete an education level record by ID
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}