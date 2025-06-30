package com.example.employee_management.repository;

import com.example.employee_management.entity.EmpExperience;
// import com.example.employee_management.entity.HrEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpExperienceRepository extends JpaRepository<EmpExperience, Long> {

    // Find by primary key
    EmpExperience findByEmpExpeId(Long empExpeId);

    // Find all experiences for a specific employee
    List<EmpExperience> findByEmpId(String empId);

    // Find all experiences with employee data (eager loading)
    @Query("SELECT e FROM EmpExperience e JOIN FETCH e.employee WHERE e.empId = :empId")
    List<EmpExperience> findByEmployee_EmpIdWithEmployee(String empId);

    // Find experience by ID with employee data (eager loading)
    @Query("SELECT e FROM EmpExperience e JOIN FETCH e.employee WHERE e.empExpeId = :empExpeId")
    EmpExperience findByEmpExpeIdWithEmployee(Long empExpeId);

    // Count experiences for an employee
    long countByEmpId(String empId);

    // Check if experience exists for an employee
    boolean existsByEmpExpeIdAndEmpId(Long empExpeId, String empId);

    // Delete all experiences for an employee
    void deleteByEmpId(String empId);
}