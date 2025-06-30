package com.example.employee_management.repository;

import com.example.employee_management.entity.Dependent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DependentRepository extends JpaRepository<Dependent, String> {
    List<Dependent> findByEmployeeEmpId(String empId);

    Optional<Dependent> findByDependentsIdAndEmployeeEmpId(String dependentsId, String empId);
}