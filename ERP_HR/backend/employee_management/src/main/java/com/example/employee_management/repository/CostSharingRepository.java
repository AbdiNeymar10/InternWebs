package com.example.employee_management.repository;

import com.example.employee_management.entity.CostSharing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CostSharingRepository extends JpaRepository<CostSharing, Long> {
    List<CostSharing> findByEmployee_EmpId(String empId);
}