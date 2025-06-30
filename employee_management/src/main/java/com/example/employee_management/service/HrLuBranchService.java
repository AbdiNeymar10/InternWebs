package com.example.employee_management.service;


import com.example.employee_management.entity.HrLuBranch;
import com.example.employee_management.repository.HrLuBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuBranchService {

    private final HrLuBranchRepository hrLuBranchRepository;

    @Autowired
    public HrLuBranchService(HrLuBranchRepository hrLuBranchRepository) {
        this.hrLuBranchRepository = hrLuBranchRepository;
    }

    // Create
    public HrLuBranch createHrLuBranch(HrLuBranch hrLuBranch) {
        return hrLuBranchRepository.save(hrLuBranch);
    }

    // Read All
    public List<HrLuBranch> getAllHrLuBranches() {
        return hrLuBranchRepository.findAll();
    }

    // Read by ID
    public Optional<HrLuBranch> getHrLuBranchById(Long id) {
        return hrLuBranchRepository.findById(id);
    }

    // Update
    public HrLuBranch updateHrLuBranch(Long id, HrLuBranch updatedHrLuBranch) {
        return hrLuBranchRepository.findById(id)
                .map(hrLuBranch -> {
                    hrLuBranch.setBranchName(updatedHrLuBranch.getBranchName());
                    hrLuBranch.setPercentage(updatedHrLuBranch.getPercentage());
                    return hrLuBranchRepository.save(hrLuBranch);
                })
                .orElseGet(() -> {
                    updatedHrLuBranch.setId(id);
                    return hrLuBranchRepository.save(updatedHrLuBranch);
                });
    }

    // Delete
    public void deleteHrLuBranch(Long id) {
        hrLuBranchRepository.deleteById(id);
    }
}
