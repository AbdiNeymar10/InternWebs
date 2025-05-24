package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRTransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HRTransferRequestRepository extends JpaRepository<HRTransferRequest, Long> {
}