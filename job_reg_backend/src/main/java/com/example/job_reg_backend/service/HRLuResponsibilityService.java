package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HrLuResponsibility;
import com.example.job_reg_backend.repository.HRLuResponsibilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRLuResponsibilityService {

    @Autowired
    private HRLuResponsibilityRepository repository;

    public List<HrLuResponsibility> getAll() {
        return repository.findAll();
    }

    public Optional<HrLuResponsibility> getById(Long id) {
        return repository.findById(id);
    }

    public HrLuResponsibility save(HrLuResponsibility responsibility) {
        return repository.save(responsibility);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}