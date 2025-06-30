package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuJobGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrLuJobGradeRepository extends JpaRepository<HrLuJobGrade, Long> {
    
}