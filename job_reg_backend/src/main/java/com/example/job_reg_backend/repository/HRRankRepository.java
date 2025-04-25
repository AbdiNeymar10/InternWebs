package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Add this import

@Repository
public interface HRRankRepository extends JpaRepository<HRRank, Long> {
    List<HRRank> findByIcfIdAndJobGradeId(Long icfId, Long jobGradeId);
}