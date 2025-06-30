package com.example.employee_management.service;

import com.example.employee_management.entity.HR_LuIcf;
import com.example.employee_management.repository.HR_LuIcfRepository;
import org.springframework.stereotype.Service;

import java.util.List;
//import java.util.Optional;

@Service
public class HR_LuIcfService {

    private final HR_LuIcfRepository repository;

    public HR_LuIcfService(HR_LuIcfRepository repository) {
        this.repository = repository;
    }
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    // Fetch all ICFs
    public List<HR_LuIcf> findAll() {
        return repository.findAll();
    }

    // Fetch ICF by ID
    public HR_LuIcf findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("ICF not found with ID: " + id));
    }
    // Create or Update ICF
    public HR_LuIcf save(HR_LuIcf icf) {
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