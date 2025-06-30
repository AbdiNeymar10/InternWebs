package com.example.employee_management.service;

import com.example.employee_management.entity.HrRank;
import java.util.List;

public interface HrRankService {
    List<HrRank> findAll();
    HrRank findById(Long rankId);
    HrRank save(HrRank hrRank);
    void deleteById(Long rankId);
    HrRank update(Long rankId, HrRank hrRank);
    List<HrRank> findByJobGradeIdAndIcfId(Long jobGradeId, Long icfId);
}