package com.example.employee_management.service;

import com.example.employee_management.entity.FieldOf_Study;
import com.example.employee_management.repository.FieldOf_StudyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldOf_StudyService {

    private final FieldOf_StudyRepository repository;

    public FieldOf_StudyService(FieldOf_StudyRepository repository) {
        this.repository = repository;
    }

    // Fetch all fields of study
    public List<FieldOf_Study> findAll() {
        return repository.findAll();
    }

    // Fetch a field of study by ID
    public FieldOf_Study findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Create or update a field of study
    public FieldOf_Study save(FieldOf_Study fieldOfStudy) {
        return repository.save(fieldOfStudy);
    }

    // Delete a field of study by ID
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}