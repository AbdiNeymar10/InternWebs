// HrPayGradeServiceImpl.java
package com.example.employee_management.service.impl;

import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.entity.HrRank;
import com.example.employee_management.repository.HrPayGradeRepository;
import com.example.employee_management.service.HrPayGradeService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HrPayGradeServiceImpl implements HrPayGradeService {
    private final HrPayGradeRepository hrPayGradeRepository;

    public HrPayGradeServiceImpl(HrPayGradeRepository hrPayGradeRepository) {
        this.hrPayGradeRepository = hrPayGradeRepository;
    }
    @Override
    public List<HrPayGrad> findAll() {
        return hrPayGradeRepository.findAll();
    }

    @Override
    public HrPayGrad findById(Long payGradeId) {
        return hrPayGradeRepository.findById(payGradeId)
                .orElseThrow(() -> new RuntimeException("HR Pay Grade not found with id: " + payGradeId));
    }

    @Override
    public HrPayGrad save(HrPayGrad hrPayGrad) {
        return hrPayGradeRepository.save(hrPayGrad);
    }

    @Override
    public void deleteById(Long payGradeId) {
        hrPayGradeRepository.deleteById(payGradeId);
    }

    @Override
    public HrPayGrad update(Long payGradeId, HrPayGrad hrPayGrad) {
        HrPayGrad existingPayGrade = findById(payGradeId);
        existingPayGrade.setSalary(hrPayGrad.getSalary());
        existingPayGrade.setStepNo(hrPayGrad.getStepNo());
        existingPayGrade.setRankId(hrPayGrad.getRankId());
        return hrPayGradeRepository.save(existingPayGrade);
    }

    // In HrPayGradeServiceImpl.java
    @Override
    public List<HrPayGrad> findByRankId(HrRank rankId) {
        return hrPayGradeRepository.findByRankId(rankId); // Corrected call
    }


    @Override
    public Optional<HrPayGrad> findByRankIdAndStepNo(HrRank rankId, String stepNo) {
        return hrPayGradeRepository.findByRankIdAndStepNo(rankId, stepNo);
    }
}