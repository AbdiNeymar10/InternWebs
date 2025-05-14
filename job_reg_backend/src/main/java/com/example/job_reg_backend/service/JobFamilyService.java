package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.JobFamily;
import com.example.job_reg_backend.repository.JobFamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobFamilyService {

    @Autowired
    private JobFamilyRepository jobFamilyRepository;

    public List<JobFamily> getAllJobFamilies() {
        return jobFamilyRepository.findAll();
    }

    public JobFamily getJobFamilyById(Long id) {
        return jobFamilyRepository.findById(id).orElse(null);
    }

    public JobFamily createJobFamily(JobFamily jobFamily) {
        return jobFamilyRepository.save(jobFamily);
    }

    public JobFamily updateJobFamily(Long id, JobFamily updatedJobFamily) {
        return jobFamilyRepository.findById(id).map(jobFamily -> {
            jobFamily.setFamilyCode(updatedJobFamily.getFamilyCode());
            jobFamily.setFamilyName(updatedJobFamily.getFamilyName());
            jobFamily.setStatus(updatedJobFamily.getStatus());
            return jobFamilyRepository.save(jobFamily);
        }).orElse(null);
    }

    public void deleteJobFamily(Long id) {
        jobFamilyRepository.deleteById(id);
    }
}