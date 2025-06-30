package com.example.employee_management.service;

import com.example.employee_management.entity.Education_Level;
import com.example.employee_management.repository.Education_LevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Education_LevelService {

    private final Education_LevelRepository repository;

    public Education_LevelService(Education_LevelRepository repository) {
        this.repository = repository;
    }

    // Fetch all education level records
    public List<Education_Level> findAll() {
        return repository.findAll();
    }

    // Fetch education level by ID
    public Education_Level findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Create or update an education level record
    public Education_Level save(Education_Level educationLevel) {
        return repository.save(educationLevel);
    }

    // Delete an education level record by ID
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}