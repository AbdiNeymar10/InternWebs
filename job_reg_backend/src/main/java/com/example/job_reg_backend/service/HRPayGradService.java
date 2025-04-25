package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRPayGrad;
import com.example.job_reg_backend.model.HRRank;
import com.example.job_reg_backend.repository.HRPayGradRepository;
import com.example.job_reg_backend.repository.HRRankRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRPayGradService {

    private final HRPayGradRepository payGradRepository;
    private final HRRankRepository rankRepository;

    public HRPayGradService(HRPayGradRepository payGradRepository, HRRankRepository rankRepository) {
        this.payGradRepository = payGradRepository;
        this.rankRepository = rankRepository;
    }

    // Fetch all pay grades
    public List<HRPayGrad> getAllPayGrades() {
        return payGradRepository.findAll();
    }

    // Fetch a specific pay grade by ID
    public Optional<HRPayGrad> getPayGradeById(Long id) {
        return payGradRepository.findById(id);
    }

    // Save a single pay grade
    public HRPayGrad savePayGrade(HRPayGrad payGrad) {
        return payGradRepository.save(payGrad);
    }

    // Save multiple pay grades
    public void saveAll(List<HRPayGrad> payGrades) {
        payGradRepository.saveAll(payGrades);
    }

    // Delete a specific pay grade by ID
    public void deletePayGrade(Long id) {
        payGradRepository.deleteById(id);
    }

    // Fetch ranks by classId and icfId
    public List<HRRank> getRanksByClassAndIcf(Long classId, Long icfId) {
        return rankRepository.findByIcfIdAndJobGradeId(icfId, classId);
    }
    public List<HRPayGrad> getPayGradesByRankIds(List<Long> rankIds) {
    return payGradRepository.findByRankRankIdIn(rankIds);
   }

    // Fetch pay grades by rankId
    public List<HRPayGrad> getPayGradesByRankId(Long rankId) {
        return payGradRepository.findByRankRankId(rankId);
    }
}