package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuResponsibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrLuResponsibilityRepository extends JpaRepository<HrLuResponsibility, Long> {
}