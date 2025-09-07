package com.example.employee_management.repository;

import com.example.employee_management.entity.EmployeeSeparation;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeSeparationRepository extends JpaRepository<EmployeeSeparation, String> {
    List<EmployeeSeparation> findByEmployeeId(String employeeId);
    List<EmployeeSeparation> findByStatus(Integer status);
    List<EmployeeSeparation> findByStatus(Integer status, Sort sort);

    // Add this new method
    List<EmployeeSeparation> findByEmployeeIdAndStatusIn(String employeeId, List<Integer> statuses);
}