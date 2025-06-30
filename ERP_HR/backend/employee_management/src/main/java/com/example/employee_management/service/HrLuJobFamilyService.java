package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuJobFamily;
import com.example.employee_management.repository.HrLuJobFamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class HrLuJobFamilyService {

    private final HrLuJobFamilyRepository repository;

    @Autowired
    public HrLuJobFamilyService(HrLuJobFamilyRepository repository) {
        this.repository = repository;
    }

    public HrLuJobFamily create(HrLuJobFamily jobFamily) {
        return repository.save(jobFamily);
    }

    public List<HrLuJobFamily> findAll() {
        return repository.findAll();
    }

    public Optional<HrLuJobFamily> findById(Integer id) {
        return repository.findById(id);
    }

    public HrLuJobFamily update(HrLuJobFamily jobFamily) {
        return repository.save(jobFamily);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public HrLuJobFamily getJobFamilyById(Long id) {
        return repository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("Job Family not found with id: " + id));
    }
}