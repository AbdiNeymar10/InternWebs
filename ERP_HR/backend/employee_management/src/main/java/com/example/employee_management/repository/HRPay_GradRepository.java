package com.example.employee_management.repository;

import com.example.employee_management.entity.HRPay_Grad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface HRPay_GradRepository extends JpaRepository<HRPay_Grad, Long> {
   List<HRPay_Grad> findByRankRankId(Long rankId);  
   List<HRPay_Grad> findByRankRankIdIn(List<Long> rankIds);
   @Query("SELECT DISTINCT p.stepNo FROM HRPay_Grad p WHERE p.stepNo IS NOT NULL")
   List<String> findDistinctStepNo();
}