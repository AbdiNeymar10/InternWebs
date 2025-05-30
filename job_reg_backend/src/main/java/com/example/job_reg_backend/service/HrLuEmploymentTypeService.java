package com.example.job_reg_backend.service;
import com.example.job_reg_backend.model.HrLuEmploymentType;
import com.example.job_reg_backend.repository.HrLuEmploymentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuEmploymentTypeService {

    private final HrLuEmploymentTypeRepository employmentTypeRepository;

    @Autowired
    public HrLuEmploymentTypeService(HrLuEmploymentTypeRepository employmentTypeRepository) {
        this.employmentTypeRepository = employmentTypeRepository;
    }

    public List<HrLuEmploymentType> getAllEmploymentTypes() {
        return employmentTypeRepository.findAll();
    }

    public Optional<HrLuEmploymentType> getEmploymentTypeById(Integer id) {
        return employmentTypeRepository.findById(id);
    }

    public HrLuEmploymentType createEmploymentType(HrLuEmploymentType employmentType) {
        return employmentTypeRepository.save(employmentType);
    }

    public HrLuEmploymentType updateEmploymentType(Integer id, HrLuEmploymentType employmentTypeDetails) {
        return employmentTypeRepository.findById(id)
                .map(employmentType -> {
                    employmentType.setType(employmentTypeDetails.getType());
                    return employmentTypeRepository.save(employmentType);
                })
                .orElseGet(() -> {
                    employmentTypeDetails.setId(id);
                    return employmentTypeRepository.save(employmentTypeDetails);
                });
    }

    public void deleteEmploymentType(Integer id) {
        employmentTypeRepository.deleteById(id);
    }
}