package com.example.employee_management.repository;

import com.example.employee_management.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findByEmployee_EmpId(String employeeId);
}