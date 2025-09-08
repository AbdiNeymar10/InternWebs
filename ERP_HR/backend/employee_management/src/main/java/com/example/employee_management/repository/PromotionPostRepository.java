package com.example.employee_management.repository;

import com.example.employee_management.entity.PromotionPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionPostRepository extends JpaRepository<PromotionPost, Long> {
    // In your PromotionPostRepository:
    List<PromotionPost> findByRecruitmentRequest_RecruitRequestId(Long recruitRequestId);
}