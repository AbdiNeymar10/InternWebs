package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuSeparationType;
import com.example.employee_management.repository.HrLuSeparationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuSeparationTypeService {
    @Autowired
    private HrLuSeparationTypeRepository separationTypeRepository;

    @Transactional(readOnly = true) // Good practice for read operations
    public List<HrLuSeparationType> getAllSeparationTypes() {
        // Corrected to use the repository instance and sort
        return separationTypeRepository.findAll(Sort.by(Sort.Direction.ASC, "description"));
    }

    // Keep other methods from your HrLuSeparationTypeService if they exist and are correct
    // For example:
    @Transactional(readOnly = true)
    public Optional<HrLuSeparationType> findById(String id) {
        return separationTypeRepository.findById(id);
    }

    @Transactional
    public HrLuSeparationType save(HrLuSeparationType separationType) {
        return separationTypeRepository.save(separationType);
    }

    @Transactional
    public void deleteById(String id) {
        separationTypeRepository.deleteById(id);
    }
}