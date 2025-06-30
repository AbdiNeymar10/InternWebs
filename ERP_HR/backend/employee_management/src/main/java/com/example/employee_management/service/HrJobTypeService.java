package com.example.employee_management.service;

import com.example.employee_management.dto.JobDetailsDto;
import com.example.employee_management.entity.HrJobType;
import java.util.List;

public interface HrJobTypeService {
    List<HrJobType> getAllJobTypes();
    HrJobType getJobTypeById(Long id);
    HrJobType createJobType(HrJobType hrJobType);
    HrJobType updateJobType(Long id, HrJobType hrJobType);
    void deleteJobType(Long id);
    JobDetailsDto getJobDetailsByJobTitleId(Integer jobTitleId);
}



