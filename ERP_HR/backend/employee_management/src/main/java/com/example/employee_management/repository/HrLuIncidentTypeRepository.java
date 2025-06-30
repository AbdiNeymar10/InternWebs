package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuIncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// import java.util.List; // No longer needed if findByStatus is removed

@Repository
public interface HrLuIncidentTypeRepository extends JpaRepository<HrLuIncidentType, Long> {
    // Removed the findByStatus method as the 'status' property does not exist in HrLuIncidentType
    // List<HrLuIncidentType> findByStatus(String status);
}