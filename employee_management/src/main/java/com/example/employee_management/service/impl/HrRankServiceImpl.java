package com.example.employee_management.service.impl;

import com.example.employee_management.entity.HrRank;
import com.example.employee_management.repository.HrRankRepository;
import com.example.employee_management.service.HrRankService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HrRankServiceImpl implements HrRankService {
    private final HrRankRepository hrRankRepository;

    public HrRankServiceImpl(HrRankRepository hrRankRepository) {
        this.hrRankRepository = hrRankRepository;
    }

    @Override
    public List<HrRank> findAll() {
        return hrRankRepository.findAll();
    }

    @Override
    public HrRank findById(Long rankId) {
        return hrRankRepository.findById(rankId)
                .orElseThrow(() -> new RuntimeException("HR Rank not found with id: " + rankId));
    }

    @Override
    public HrRank save(HrRank hrRank) {
        return hrRankRepository.save(hrRank);
    }

    @Override
    public void deleteById(Long rankId) {
        hrRankRepository.deleteById(rankId);
    }

    @Override
    public HrRank update(Long rankId, HrRank hrRank) {
        HrRank existingRank = findById(rankId);
        existingRank.setBeginningSalary(hrRank.getBeginningSalary());
        existingRank.setMaxSalary(hrRank.getMaxSalary());
        existingRank.setJobGradeId(hrRank.getJobGradeId());
        existingRank.setIcfId(hrRank.getIcfId());
        return hrRankRepository.save(existingRank);
    }

    @Override
    public List<HrRank> findByJobGradeIdAndIcfId(Long jobGradeId, Long icfId) {
        return hrRankRepository.findByJobGradeIdAndIcfId(jobGradeId, icfId);
    }
}