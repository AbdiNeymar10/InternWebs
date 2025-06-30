package com.example.employee_management.service.impl;

import com.example.employee_management.dto.JobDetailsDto;
import com.example.employee_management.entity.*;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.HrJobTypeRepository;
import com.example.employee_management.service.HrJobTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// import java.util.Optional;

@Service
public class HrJobTypeServiceImpl implements HrJobTypeService {

    private final HrJobTypeRepository hrJobTypeRepository;

    @Autowired
    public HrJobTypeServiceImpl(HrJobTypeRepository hrJobTypeRepository) {
        this.hrJobTypeRepository = hrJobTypeRepository;
    }

    @Override
    public List<HrJobType> getAllJobTypes() {
        return hrJobTypeRepository.findAll();
    }

    @Override
    public HrJobType getJobTypeById(Long id) {
        return hrJobTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job Type not found with id: " + id));
    }

    @Override
    public HrJobType createJobType(HrJobType hrJobType) {
        return hrJobTypeRepository.save(hrJobType);
    }

    @Override
    public HrJobType updateJobType(Long id, HrJobType hrJobTypeDetails) {
        HrJobType hrJobType = getJobTypeById(id);
        hrJobType.setJobCode(hrJobTypeDetails.getJobCode());
        hrJobType.setJobTitle(hrJobTypeDetails.getJobTitle());
        hrJobType.setJobStatus(hrJobTypeDetails.getJobStatus());
        hrJobType.setRemark(hrJobTypeDetails.getRemark());
        hrJobType.setJobFamily(hrJobTypeDetails.getJobFamily());
        hrJobType.setJobGrade(hrJobTypeDetails.getJobGrade());
        return hrJobTypeRepository.save(hrJobType);
    }

    @Override
    public void deleteJobType(Long id) {
        HrJobType hrJobType = getJobTypeById(id);
        hrJobTypeRepository.delete(hrJobType);
    }

    @Override
    public JobDetailsDto getJobDetailsByJobTitleId(Integer jobTitleId) {
        List<HrJobType> jobTypes = hrJobTypeRepository.findByJobTitle_Id(Long.valueOf(jobTitleId));

        if (jobTypes.isEmpty()) {
            throw new ResourceNotFoundException("Job details not found for job title ID: " + jobTitleId);
        }
        HrJobType jobType = jobTypes.get(0);
        JobDetailsDto dto = new JobDetailsDto();
        dto.setJobCode(jobType.getJobCode());

        if (jobType.getJobTitle() != null) {
            dto.setJobTitle(jobType.getJobTitle().getJobTitle());
        }

        if (jobType.getJobFamily() != null) {
            dto.setJobFamily(jobType.getJobFamily().getFamilyName());
            dto.setJobFamilyCode(jobType.getJobFamily().getFamilyCode());
        }

        if (jobType.getJobGrade() != null) {
            dto.setJobGrade(jobType.getJobGrade().getGrade());
            dto.setJobGradeDescription(jobType.getJobGrade().getDescription());
        }

        return dto;
    }
}