package com.example.employee_management.repository;

import com.example.employee_management.entity.PromotionApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionApplicationRepository extends JpaRepository<PromotionApplication, Long> {
    List<PromotionApplication> findByPromotionPostId(Long postId);
}