package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRLuIcf;
import com.example.job_reg_backend.repository.HRLuIcfRepository;
import org.springframework.stereotype.Service;

import java.util.List;
//import java.util.Optional;

@Service
public class HRLuIcfService {

    private final HRLuIcfRepository repository;

    public HRLuIcfService(HRLuIcfRepository repository) {
        this.repository = repository;
    }
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    // Fetch all ICFs
    public List<HRLuIcf> findAll() {
        return repository.findAll();
    }

    // Fetch ICF by ID
    public HRLuIcf findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("ICF not found with ID: " + id));
    }
    // Create or Update ICF
    public HRLuIcf save(HRLuIcf icf) {
        return repository.save(icf);
    }
    // Delete ICF by ID
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("ICF not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}