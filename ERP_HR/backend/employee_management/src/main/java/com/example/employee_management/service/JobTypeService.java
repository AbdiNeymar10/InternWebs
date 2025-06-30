package com.example.employee_management.service;

import com.example.employee_management.dto.JobTypeDTO;
import com.example.employee_management.entity.JobType;
import com.example.employee_management.repository.JobTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobTypeService {
    private final JobTypeRepository jobTypeRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public List<JobTypeDTO> getAllJobTypes() {
        try {
            log.info("Fetching all job types");
            List<JobType> jobTypes = jobTypeRepository.findAll();
            return jobTypes.stream()
                    .map(jobType -> modelMapper.map(jobType, JobTypeDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching job types: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch job types from database", e);
        }
    }

    @Transactional
    public JobTypeDTO createJobType(JobTypeDTO jobTypeDTO) {
        try {
            log.info("Attempting to create new job type with code: {}", jobTypeDTO.getCode());

            // Check if code already exists
            if (jobTypeRepository.existsByCode(jobTypeDTO.getCode())) {
                throw new RuntimeException("Job type with code " + jobTypeDTO.getCode() + " already exists.");
            }

            JobType jobType = modelMapper.map(jobTypeDTO, JobType.class);
            jobType.setId(null); // Ensure ID is null for new entity

            JobType savedJobType = jobTypeRepository.save(jobType);
            log.info("Successfully created job type with ID: {}", savedJobType.getId());
            return modelMapper.map(savedJobType, JobTypeDTO.class);
        } catch (Exception e) {
            log.error("Error creating job type: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create job type: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public JobTypeDTO getJobTypeById(Long id) {
        log.info("Fetching job type with ID: {}", id);
        JobType jobType = jobTypeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Job type not found with ID: {}", id);
                    return new RuntimeException("Job type not found with ID: " + id);
                });
        return modelMapper.map(jobType, JobTypeDTO.class);
    }

    @Transactional
    public JobTypeDTO updateJobType(Long id, JobTypeDTO jobTypeDTO) {
        log.info("Attempting to update job type with ID: {}", id);
        JobType existingJobType = jobTypeRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Job type not found for update with ID: {}", id);
                    return new RuntimeException("Job type not found with ID: " + id + " for update.");
                });

        // Check if the new code conflicts with another existing job type
        if (jobTypeDTO.getCode() != null && !jobTypeDTO.getCode().equals(existingJobType.getCode())) {
            if (jobTypeRepository.existsByCode(jobTypeDTO.getCode())) {
                throw new RuntimeException("Job type code " + jobTypeDTO.getCode() + " already exists.");
            }
        }

        modelMapper.map(jobTypeDTO, existingJobType);
        existingJobType.setId(id); // Ensure ID is not changed

        JobType updatedJobType = jobTypeRepository.save(existingJobType);
        log.info("Successfully updated job type with ID: {}", updatedJobType.getId());
        return modelMapper.map(updatedJobType, JobTypeDTO.class);
    }

    @Transactional
    public void deleteJobType(Long id) {
        log.info("Attempting to delete job type with ID: {}", id);
        if (!jobTypeRepository.existsById(id)) {
            throw new RuntimeException("Job type not found with ID: " + id + " for deletion.");
        }
        jobTypeRepository.deleteById(id);
        log.info("Successfully deleted job type with ID: {}", id);
    }
}