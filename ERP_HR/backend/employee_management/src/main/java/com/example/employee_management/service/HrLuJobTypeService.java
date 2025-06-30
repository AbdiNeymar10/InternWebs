package com.example.employee_management.service;
import com.example.employee_management.entity.HrLuJobType;
import com.example.employee_management.repository.HrLuJobTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuJobTypeService {

    private final HrLuJobTypeRepository jobTypeRepository;

    @Autowired
    public HrLuJobTypeService(HrLuJobTypeRepository jobTypeRepository) {
        this.jobTypeRepository = jobTypeRepository;
    }

    public List<HrLuJobType> getAllJobTypes() {
        return jobTypeRepository.findAll();
    }

    public Optional<HrLuJobType> getJobTypeById(Integer id) {
        return jobTypeRepository.findById(id);
    }

    public HrLuJobType createJobType(HrLuJobType jobType) {
        return jobTypeRepository.save(jobType);
    }

    public HrLuJobType updateJobType(Integer id, HrLuJobType jobTypeDetails) {
        return jobTypeRepository.findById(id)
                .map(jobType -> {
                    jobType.setJobTitle(jobTypeDetails.getJobTitle());
                    jobType.setStatus(jobTypeDetails.getStatus());
                    jobType.setCode(jobTypeDetails.getCode());
                    jobType.setJobTitleInAmharic(jobTypeDetails.getJobTitleInAmharic());
                    jobType.setDescription(jobTypeDetails.getDescription());
                    return jobTypeRepository.save(jobType);
                })
                .orElseGet(() -> {
                    jobTypeDetails.setId(id);
                    return jobTypeRepository.save(jobTypeDetails);
                });
    }

    public void deleteJobType(Integer id) {
        jobTypeRepository.deleteById(id);
    }
}
