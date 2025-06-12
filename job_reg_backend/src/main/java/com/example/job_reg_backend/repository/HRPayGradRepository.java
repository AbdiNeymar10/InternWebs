package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRPayGrad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface HRPayGradRepository extends JpaRepository<HRPayGrad, Long> {
   List<HRPayGrad> findByRankRankId(Long rankId);  
   List<HRPayGrad> findByRankRankIdIn(List<Long> rankIds);
   @Query("SELECT DISTINCT p.stepNo FROM HRPayGrad p WHERE p.stepNo IS NOT NULL")
   List<String> findDistinctStepNo();
}