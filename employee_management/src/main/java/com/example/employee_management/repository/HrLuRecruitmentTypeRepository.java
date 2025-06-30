package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuRecruitmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrLuRecruitmentTypeRepository extends JpaRepository<HrLuRecruitmentType, Integer> {
    // Custom queries can be added here
    // Example: List<HrLuRecruitmentType> findByRecruitmentTypeContaining(String type);
}