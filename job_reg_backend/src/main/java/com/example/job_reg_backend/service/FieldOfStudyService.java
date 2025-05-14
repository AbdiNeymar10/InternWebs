package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.FieldOfStudy;
import com.example.job_reg_backend.repository.FieldOfStudyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldOfStudyService {

    private final FieldOfStudyRepository repository;

    public FieldOfStudyService(FieldOfStudyRepository repository) {
        this.repository = repository;
    }

    // Fetch all fields of study
    public List<FieldOfStudy> findAll() {
        return repository.findAll();
    }

    // Fetch a field of study by ID
    public FieldOfStudy findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Create or update a field of study
    public FieldOfStudy save(FieldOfStudy fieldOfStudy) {
        return repository.save(fieldOfStudy);
    }

    // Delete a field of study by ID
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}