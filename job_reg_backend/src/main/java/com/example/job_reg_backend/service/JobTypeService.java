package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.JobType;
import com.example.job_reg_backend.repository.JobTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class JobTypeService {

    @Autowired
    private JobTypeRepository jobTypeRepository;

    // Fetch all job types
    public List<JobType> getAllJobTypes() {
        return jobTypeRepository.findAll();
    }

    // Save a new job type (with sequential code generation)
    @Transactional
public JobType saveJobType(JobType jobType) {
    if (jobType.getCode() == null || jobType.getCode().isEmpty()) {
        Integer maxCode = jobTypeRepository.findMaxCodeAsInt();
        int nextCode = (maxCode != null) ? maxCode + 1 : 100;
        jobType.setCode(String.valueOf(nextCode));
    }
    return jobTypeRepository.saveAndFlush(jobType);
}

    // Get a job type by its ID
    public JobType getJobTypeById(Long id) {
        return jobTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job type not found with ID: " + id));
    }

    // Update a job type
    @Transactional
    public JobType updateJobType(Long id, JobType jobType) {
        JobType existingJobType = jobTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job type not found with ID: " + id));

        // Update fields
        existingJobType.setJobTitle(jobType.getJobTitle());
        existingJobType.setJobTitleInAmharic(jobType.getJobTitleInAmharic());
        existingJobType.setStatus(jobType.getStatus());
        existingJobType.setDescription(jobType.getDescription());
        existingJobType.setCode(jobType.getCode());

        // Save and flush the updated job type to ensure immediate persistence
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