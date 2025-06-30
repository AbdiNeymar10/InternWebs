package com.example.employee_management.repository;

import com.example.employee_management.entity.HrEmpLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrEmpLanguageRepository extends JpaRepository<HrEmpLanguage, Long> {
    List<HrEmpLanguage> findByEmployee_EmpId(String empId);
}