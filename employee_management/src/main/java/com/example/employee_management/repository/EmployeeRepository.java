package com.example.employee_management.repository;

import com.example.employee_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Query by the 'empId' field (which maps to EMP_ID column) case-insensitively
    @Query("SELECT e FROM Employee e WHERE UPPER(e.empId) = UPPER(:empIdParam)")
    Optional<Employee> findByEmpIdIgnoreCase(@Param("empIdParam") String empId);

    // Derived query method, will query by the 'empId' field (case-sensitive by default)
    Optional<Employee> findByEmpId(String empId);

}