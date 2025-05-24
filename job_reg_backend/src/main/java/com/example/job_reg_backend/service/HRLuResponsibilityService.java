package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRLuResponsibility;
import com.example.job_reg_backend.repository.HRLuResponsibilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRLuResponsibilityService {

    @Autowired
    private HRLuResponsibilityRepository repository;

    public List<HRLuResponsibility> getAll() {
        return repository.findAll();
    }

    public Optional<HRLuResponsibility> getById(Long id) {
        return repository.findById(id);
    }

    public HRLuResponsibility save(HRLuResponsibility responsibility) {
        return repository.save(responsibility);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}