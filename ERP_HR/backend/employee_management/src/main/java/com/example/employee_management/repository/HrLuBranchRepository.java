package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrLuBranchRepository extends JpaRepository<HrLuBranch, Long> {
}