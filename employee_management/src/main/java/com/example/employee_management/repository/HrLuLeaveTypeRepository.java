package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuLeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HrLuLeaveTypeRepository extends JpaRepository<HrLuLeaveType, Long> {
}