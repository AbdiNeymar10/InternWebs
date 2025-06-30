package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveTransferDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrLeaveTransferDetailRepository extends JpaRepository<HrLeaveTransferDetail, Long> {
    @Query("SELECT d FROM HrLeaveTransferDetail d WHERE d.status = :status")
    List<HrLeaveTransferDetail> findByStatus(String status);
}