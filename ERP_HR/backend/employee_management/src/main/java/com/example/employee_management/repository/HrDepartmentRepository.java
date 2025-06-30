package com.example.employee_management.repository;

import com.example.employee_management.entity.HrDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrDepartmentRepository extends JpaRepository<HrDepartment, Long> {
    // You can add custom query methods here if needed in the future.
    // For example, to find a department by its name:
    // Optional<HrDepartment> findByDepName(String depName);
}