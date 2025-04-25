package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRRank;
import com.example.job_reg_backend.model.HRLuJobGrade;
import com.example.job_reg_backend.model.HRLuIcf;
import com.example.job_reg_backend.repository.HRRankRepository;
import com.example.job_reg_backend.repository.HRLuJobGradeRepository;
import com.example.job_reg_backend.repository.HRLuIcfRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HRRankService {

    private final HRRankRepository rankRepository;
    private final HRLuJobGradeRepository jobGradeRepository;
    private final HRLuIcfRepository icfRepository;

    public HRRankService(HRRankRepository rankRepository, HRLuJobGradeRepository jobGradeRepository, HRLuIcfRepository icfRepository) {
        this.rankRepository = rankRepository;
        this.jobGradeRepository = jobGradeRepository;
        this.icfRepository = icfRepository;
    }

    public HRRank save(HRRank rank) {
        try {
            // Resolve jobGrade and icf references
            HRLuJobGrade jobGrade = jobGradeRepository.findById(rank.getJobGrade().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Job Grade ID: " + rank.getJobGrade().getId()));
            HRLuIcf icf = icfRepository.findById(rank.getIcf().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid ICF ID: " + rank.getIcf().getId()));

            rank.setJobGrade(jobGrade);
            rank.setIcf(icf);

            return rankRepository.save(rank);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<HRRank> saveAll(List<HRRank> ranks) {
    try {
        System.out.println("Saving ranks: " + ranks);
        return rankRepository.saveAll(ranks); // Save all ranks in bulk
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error saving ranks: " + e.getMessage(), e);
    }
}
    public List<HRRank> findAll() {
        return rankRepository.findAll(); // Fetch all HRRank entries from the database
    }

    public List<HRRank> findByIcfAndClass(Long icfId, Long classId) {
        return rankRepository.findByIcfIdAndJobGradeId(icfId, classId);
    }

    public void deleteById(Long id) {
        rankRepository.deleteById(id);
    }
}