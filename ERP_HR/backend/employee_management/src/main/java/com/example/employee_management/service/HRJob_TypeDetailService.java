package com.example.employee_management.service;

import com.example.employee_management.entity.HRJob_TypeDetail;
import com.example.employee_management.repository.HRJob_TypeDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HRJob_TypeDetailService {

    private final HRJob_TypeDetailRepository repository;

    public HRJob_TypeDetailService(HRJob_TypeDetailRepository repository) {
        this.repository = repository;
    }

    // Save a single HRJobTypeDetail
    public HRJob_TypeDetail save(HRJob_TypeDetail jobTypeDetail) {
        return repository.save(jobTypeDetail);
    }

    // Save multiple HRJobTypeDetails
    public List<HRJob_TypeDetail> saveAll(List<HRJob_TypeDetail> jobTypeDetails) {
        return repository.saveAll(jobTypeDetails);
    }

    // Find a job type detail by ID
    public HRJob_TypeDetail findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job Type Detail not found with ID: " + id));
    }
    public List<HRJob_TypeDetail> findByJobTitleAndClass(String jobTitle, String jobClass) {
    return repository.findByJobTitleAndClass(jobTitle, jobClass);
    }

   public List<String> findDistinctIcfValues() {
    return repository.findDistinctIcfValues();
}
    // Find all job type details
    public List<HRJob_TypeDetail> findAll() {
        return repository.findAll();
    }

    public List<String> findIcfValuesByJobTypeId(Long jobTypeId) {
    return repository.findIcfValuesByJobTypeId(jobTypeId);
}

    // Delete a job type detail by ID
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<HRJob_TypeDetail> findByJobTypeId(Long jobTypeId) {
        return repository.findByJobTypeId(jobTypeId);
    }
}