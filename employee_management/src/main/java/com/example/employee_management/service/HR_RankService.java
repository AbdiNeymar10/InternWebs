package com.example.employee_management.service;

import com.example.employee_management.entity.HR_Rank;
import com.example.employee_management.entity.HrLuJobGrade;
import com.example.employee_management.entity.HR_LuIcf;
import com.example.employee_management.repository.HR_RankRepository;
import com.example.employee_management.repository.HrLuJobGradeRepository;
import com.example.employee_management.repository.HR_LuIcfRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HR_RankService {

    private final HR_RankRepository rankRepository;
    private final HrLuJobGradeRepository jobGradeRepository;
    private final HR_LuIcfRepository icfRepository;

    public HR_RankService(HR_RankRepository rankRepository, HrLuJobGradeRepository jobGradeRepository, HR_LuIcfRepository icfRepository) {
        this.rankRepository = rankRepository;
        this.jobGradeRepository = jobGradeRepository;
        this.icfRepository = icfRepository;
    }

    public Optional<HR_Rank> findById(Long id) {
        return rankRepository.findById(id);
    }

    public HR_Rank save(HR_Rank rank) {
    try {
        HrLuJobGrade jobGrade = jobGradeRepository.findById(rank.getJobGrade().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Job Grade ID: " + rank.getJobGrade().getId()));
        HR_LuIcf icf = icfRepository.findById(rank.getIcf().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid ICF ID: " + rank.getIcf().getId()));

        rank.setJobGrade(jobGrade);
        rank.setIcf(icf);

        return rankRepository.save(rank);
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error saving rank: " + e.getMessage(), e);
    }
}

    // Save multiple ranks
    public List<HR_Rank> saveAll(List<HR_Rank> ranks) {
        try {
            for (HR_Rank rank : ranks) {
                HrLuJobGrade jobGrade = jobGradeRepository.findById(rank.getJobGrade().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid Job Grade ID: " + rank.getJobGrade().getId()));
                HR_LuIcf icf = icfRepository.findById(rank.getIcf().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid ICF ID: " + rank.getIcf().getId()));

                rank.setJobGrade(jobGrade);
                rank.setIcf(icf);
            }

            return rankRepository.saveAll(ranks); 
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error saving ranks: " + e.getMessage(), e);
        }
    }

    public List<HR_Rank> findAll() {
        return rankRepository.findAll();
    }

    public List<HR_Rank> findByIcfAndClass(Long icfId, Long classId) {
        return rankRepository.findByIcfIdAndJobGradeId(icfId, classId);
    }

    public void deleteById(Long id) {
        rankRepository.deleteById(id);
    }
}