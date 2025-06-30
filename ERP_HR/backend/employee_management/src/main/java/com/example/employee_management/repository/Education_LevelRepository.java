package com.example.employee_management.repository;

import com.example.employee_management.entity.Education_Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Education_LevelRepository extends JpaRepository<Education_Level, Long> {
}