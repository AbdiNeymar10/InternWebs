package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuJobGrade;
import java.util.List;

public interface HrLuJobGradeService {
    // Fetch all job grades
    List<HrLuJobGrade> findAll();

    // Fetch job grade by ID
    HrLuJobGrade findById(Long id);

    // Create or Update job grade
    HrLuJobGrade save(HrLuJobGrade hrLuJobGrade);

    // Delete job grade by ID
    void deleteById(Long id);
    // Add other business methods as needed
}