package com.example.employee_management.repository;

import com.example.employee_management.entity.HREmpPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HREmpPromotionRepository extends JpaRepository<HREmpPromotion, Long> {
    // Add custom query methods here if needed
}