package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveScheduleDet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HrLeaveScheduleDetRepository extends JpaRepository<HrLeaveScheduleDet, Long> {
    List<HrLeaveScheduleDet> findByHrLeaveScheduleId(Long scheduleId);
}