package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRLuJobGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HRLuJobGradeRepository extends JpaRepository<HRLuJobGrade, Long> {
    
}