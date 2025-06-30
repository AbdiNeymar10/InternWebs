package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrLeaveTransferRepository extends JpaRepository<HrLeaveTransfer, Long> {
    List<HrLeaveTransfer> findByRequesterId(String requesterId);
}