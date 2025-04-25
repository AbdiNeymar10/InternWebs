package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRJobTypeDetail;
import com.example.job_reg_backend.repository.HRJobTypeDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HRJobTypeDetailService {

    private final HRJobTypeDetailRepository repository;

    public HRJobTypeDetailService(HRJobTypeDetailRepository repository) {
        this.repository = repository;
    }

    // Save a single HRJobTypeDetail
    public HRJobTypeDetail save(HRJobTypeDetail jobTypeDetail) {
        return repository.save(jobTypeDetail);
    }

    // Save multiple HRJobTypeDetails
    public List<HRJobTypeDetail> saveAll(List<HRJobTypeDetail> jobTypeDetails) {
        return repository.saveAll(jobTypeDetails);
    }

    // Find a job type detail by ID
    public HRJobTypeDetail findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job Type Detail not found with ID: " + id));
    }
    public List<HRJobTypeDetail> findByJobTitleAndClass(String jobTitle, String jobClass) {
    return repository.findByJobTitleAndClass(jobTitle, jobClass);
    }

    // Find all job type details
    public List<HRJobTypeDetail> findAll() {
        return repository.findAll();
    }

    // Delete a job type detail by ID
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}