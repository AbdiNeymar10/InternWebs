package com.example.employee_management.repository;



import com.example.employee_management.entity.SeparationApprove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeparationApproveRepository extends JpaRepository<SeparationApprove, String> {
    List<SeparationApprove> findBySeparationRequestId(String separationRequestId);
    List<SeparationApprove> findByEmployeeId(String employeeId);
}