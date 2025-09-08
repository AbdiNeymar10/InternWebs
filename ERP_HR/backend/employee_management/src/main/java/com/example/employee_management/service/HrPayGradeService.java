package com.example.employee_management.service;

import com.example.employee_management.dto.HrPayGradeDto; // Import the DTO
import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.entity.HrRank;

import java.util.List;
import java.util.Optional;

public interface HrPayGradeService {
    List<HrPayGrad> findAll();
    HrPayGrad findById(Long payGradeId);
    HrPayGrad save(HrPayGrad hrPayGrad);
    void deleteById(Long payGradeId);
    HrPayGrad update(Long payGradeId, HrPayGrad hrPayGrad);
    List<HrPayGrad> findByRankId(HrRank rankId);

    // MODIFIED: Change return type to Optional<HrPayGradeDto>
    Optional<HrPayGradeDto> findByRankIdAndStepNo(HrRank rankId, String stepNo);
}