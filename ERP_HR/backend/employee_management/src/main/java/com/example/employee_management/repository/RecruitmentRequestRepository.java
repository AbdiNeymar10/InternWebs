package com.example.employee_management.repository;

import com.example.employee_management.entity.RecruitmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecruitmentRequestRepository extends JpaRepository<RecruitmentRequest, Long> {
    List<RecruitmentRequest> findByRequestStatus(String status);

    // This method is used for case-sensitive checks (keep it if needed elsewhere)
    Optional<RecruitmentRequest> findByRecruitBatchCode(String recruitBatchCode);

    // ✅ ADDED: Case-insensitive search for recruitBatchCode
    Optional<RecruitmentRequest> findByRecruitBatchCodeIgnoreCase(String recruitBatchCode);
}