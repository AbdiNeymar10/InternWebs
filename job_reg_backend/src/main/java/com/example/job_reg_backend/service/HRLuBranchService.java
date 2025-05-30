package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HrLuBranch;
import com.example.job_reg_backend.repository.HRLuBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRLuBranchService {

    @Autowired
    private HRLuBranchRepository repository;

    public List<HrLuBranch> getAll() {
        return repository.findAll();
    }

    public Optional<HrLuBranch> getById(Long id) {
        return repository.findById(id);
    }

    public HrLuBranch save(HrLuBranch branch) {
        return repository.save(branch);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}