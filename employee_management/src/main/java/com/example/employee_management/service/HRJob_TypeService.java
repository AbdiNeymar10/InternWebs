package com.example.employee_management.service;

import com.example.employee_management.entity.HRJob_Type;
import com.example.employee_management.repository.HRJob_TypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class HRJob_TypeService {

    private final HRJob_TypeRepository repository;

    @Autowired
    private HRJob_TypeRepository hrJobTypeRepository;

    public HRJob_TypeService(HRJob_TypeRepository repository) {
        this.repository = repository;
    }
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    // Fetch all job types
    public List<HRJob_Type> findAll() {
        return repository.findAll();
    }

    // Fetch job type by ID
    public HRJob_Type findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job Type not found with ID: " + id));
    }

    // Fetch job type by job title
    public HRJob_Type findByJobTitle(String jobTitle) {
        return repository.findByJobTitle_JobTitle(jobTitle)
                .orElseThrow(() -> new RuntimeException("Job Type not found with title: " + jobTitle));
    }
    public List<HRJob_Type> findByJobTitleIds(List<Long> jobTitleIds) {
    return repository.findByJobTitleIds(jobTitleIds);
}

    // Create or Update job type
    public HRJob_Type save(HRJob_Type jobType) {
        return repository.save(jobType);
    }
    // Fetch job type by job family and job title
public HRJob_Type findByJobFamilyAndJobTitle(Long jobFamilyId, Long jobTitleId) {
    List<HRJob_Type> jtList = hrJobTypeRepository.findByJobFamilyAndJobTitle_Id(jobFamilyId, jobTitleId);
    if (!jtList.isEmpty()) return jtList.get(0);
    List<HRJob_Type> fallbackList = hrJobTypeRepository.findByJobTitle_IdAndJobFamilyIsNull(jobTitleId);
    if (!fallbackList.isEmpty()) return fallbackList.get(0);
    List<HRJob_Type> anyList = hrJobTypeRepository.findByJobTitle_Id(jobTitleId);
    if (!anyList.isEmpty()) return anyList.get(0);
    return null;
}

    public List<HRJob_Type> findByJobFamily(Long jobFamilyId) {
    return hrJobTypeRepository.findByJobFamily(jobFamilyId);
}
    // Delete job type by ID
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Job Type not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    public String getLastJobCode(Long jobTitleId) {
        return repository.findLastJobCodeByJobTitleId(jobTitleId);
    }

    // Generate a new job code
    public String generateJobCode(String lastCode, Long jobTitleId) {
        String prefix = "INSA/" + String.format("%03d", jobTitleId) + "/";
        int nextNumber = 1;

        if (lastCode != null && lastCode.startsWith(prefix)) {
            String[] parts = lastCode.split("/");
            nextNumber = Integer.parseInt(parts[2]) + 1;
        }

        return prefix + String.format("%03d", nextNumber);
    }
}