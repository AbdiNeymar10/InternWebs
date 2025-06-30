package com.example.employee_management.repository;

import com.example.employee_management.entity.HrPowerDelegation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HrPowerDelegationRepository extends JpaRepository<HrPowerDelegation, Long> {
    List<HrPowerDelegation> findByDelegatorId(String delegatorId);
    List<HrPowerDelegation> findByDelegateeId(String delegateeId);
}