package com.example.employee_management.service;

import com.example.employee_management.entity.Job_Type;
import com.example.employee_management.repository.Job_TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class Job_TypeService {

    @Autowired
    private Job_TypeRepository jobTypeRepository;

    // Fetch all job types
    public List<Job_Type> getAllJobTypes() {
        return jobTypeRepository.findAll();
    }

    @Transactional
public Job_Type saveJobType(Job_Type jobType) {
    if (jobType.getCode() == null || jobType.getCode().isEmpty()) {
        Integer maxCode = jobTypeRepository.findMaxCodeAsInt();
        int nextCode = (maxCode != null) ? maxCode + 1 : 100;
        jobType.setCode(String.valueOf(nextCode));
    }
    return jobTypeRepository.saveAndFlush(jobType);
}

    // Get a job type by its ID
    public Job_Type getJobTypeById(Long id) {
        return jobTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job type not found with ID: " + id));
    }

    // Update a job type
    @Transactional
    public Job_Type updateJobType(Long id, Job_Type jobType) {
        Job_Type existingJobType = jobTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job type not found with ID: " + id));

        // Update fields
        existingJobType.setJobTitle(jobType.getJobTitle());
        existingJobType.setJobTitleInAmharic(jobType.getJobTitleInAmharic());
        existingJobType.setStatus(jobType.getStatus());
        existingJobType.setDescription(jobType.getDescription());
        existingJobType.setCode(jobType.getCode());

        return jobTypeRepository.saveAndFlush(existingJobType);
    }

    // Delete a job type
    @Transactional
    public void deleteJobType(Long id) {
        if (!jobTypeRepository.existsById(id)) {
            throw new RuntimeException("Job type not found with ID: " + id);
        }
        jobTypeRepository.deleteById(id);
    }
}