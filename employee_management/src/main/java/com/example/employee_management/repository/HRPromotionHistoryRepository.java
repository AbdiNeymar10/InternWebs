package com.example.employee_management.repository;

import com.example.employee_management.entity.HRPromotionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HRPromotionHistoryRepository extends JpaRepository<HRPromotionHistory, Long> {
}