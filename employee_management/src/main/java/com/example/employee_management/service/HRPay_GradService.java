package com.example.employee_management.service;

import com.example.employee_management.entity.HRPay_Grad;
import com.example.employee_management.entity.HR_Rank;
import com.example.employee_management.repository.HRPay_GradRepository;
import com.example.employee_management.repository.HR_RankRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRPay_GradService {

    private final HRPay_GradRepository payGradRepository;
    private final HR_RankRepository rankRepository;

    public HRPay_GradService(HRPay_GradRepository payGradRepository, HR_RankRepository rankRepository) {
        this.payGradRepository = payGradRepository;
        this.rankRepository = rankRepository;
    }

    // Fetch all pay grades
    public List<HRPay_Grad> getAllPayGrades() {
        return payGradRepository.findAll();
    }

    // Fetch a specific pay grade by ID
    public Optional<HRPay_Grad> getPayGradeById(Long id) {
        return payGradRepository.findById(id);
    }

    // Save a single pay grade
    public HRPay_Grad savePayGrade(HRPay_Grad payGrad) {
    try {
        if (payGrad.getRank() != null && payGrad.getRank().getRankId() != null) {
            HR_Rank rank = rankRepository.findById(payGrad.getRank().getRankId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Rank ID: " + payGrad.getRank().getRankId()));
            payGrad.setRank(rank);
        } else {
            throw new IllegalArgumentException("Rank is required for saving a pay grade.");
        }

        return payGradRepository.save(payGrad);
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error saving pay grade: " + e.getMessage(), e);
    }
}

    // Save multiple pay grades
    public void saveAll(List<HRPay_Grad> payGrades) {
        payGradRepository.saveAll(payGrades);
    }

    public void deletePayGrade(Long id) {
        payGradRepository.deleteById(id);
    }

    // Fetch ranks by classId and icfId
    public List<HR_Rank> getRanksByClassAndIcf(Long classId, Long icfId) {
        return rankRepository.findByIcfIdAndJobGradeId(icfId, classId);
    }
    public List<HRPay_Grad> getPayGradesByRankIds(List<Long> rankIds) {
    return payGradRepository.findByRankRankIdIn(rankIds);
   }

    // Fetch pay grades by rankId
    public List<HRPay_Grad> getPayGradesByRankId(Long rankId) {
        return payGradRepository.findByRankRankId(rankId);
    }

    // Fetch all unique STEP_NO values
    public List<String> getAllStepNos() {
        return payGradRepository.findDistinctStepNo();
    }
}