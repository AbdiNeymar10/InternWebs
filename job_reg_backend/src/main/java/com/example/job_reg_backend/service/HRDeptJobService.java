package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRDeptJob;
import com.example.job_reg_backend.repository.HRDeptJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRDeptJobService {

    @Autowired
    private HRDeptJobRepository hrDeptJobRepository;

    public List<HRDeptJob> getAllDeptJobs() {
        return hrDeptJobRepository.findAll();
    }

    public Optional<HRDeptJob> getDeptJobById(Long id) {
        return hrDeptJobRepository.findById(id);
    }

    public HRDeptJob saveDeptJob(HRDeptJob hrDeptJob) {
        return hrDeptJobRepository.save(hrDeptJob);
    }

    public void deleteDeptJob(Long id) {
        hrDeptJobRepository.deleteById(id);
    }
}