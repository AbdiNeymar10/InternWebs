package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuJobFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrLuJobFamilyRepository extends JpaRepository<HrLuJobFamily, Integer> {
    // Custom queries can be added here if needed
    // Example:
    // List<HrLuJobFamily> findByStatus(String status);
}
