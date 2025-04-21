package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRLuJobGrade;
import com.example.job_reg_backend.repository.HRLuJobGradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HRLuJobGradeService {

    private final HRLuJobGradeRepository repository;

    public HRLuJobGradeService(HRLuJobGradeRepository repository) {
        this.repository = repository;
    }

    // Fetch all job grades
    public List<HRLuJobGrade> findAll() {
        return repository.findAll();
    }

    // Fetch job grade by ID
    public HRLuJobGrade findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job Grade not found with ID: " + id));
    }

    // Create or Update job grade
public HRLuJobGrade save(HRLuJobGrade jobGrade) {
    if (jobGrade.getId() != null) {
        // Check if the entity exists in the database
        HRLuJobGrade existingJobGrade = repository.findById(jobGrade.getId())
            .orElseThrow(() -> new RuntimeException("Job Grade not found with ID: " + jobGrade.getId()));
        // Update the existing entity
        existingJobGrade.setGrade(jobGrade.getGrade());
        existingJobGrade.setDescription(jobGrade.getDescription());
        return repository.save(existingJobGrade);
    }
    // Save a new entity
    return repository.save(jobGrade);
}
    // Delete job grade by ID
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Job Grade not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}