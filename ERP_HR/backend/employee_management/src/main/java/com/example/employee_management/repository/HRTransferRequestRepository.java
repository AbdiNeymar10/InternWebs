package com.example.employee_management.repository;

import com.example.employee_management.entity.HRTransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HRTransferRequestRepository extends JpaRepository<HRTransferRequest, Long> {
}