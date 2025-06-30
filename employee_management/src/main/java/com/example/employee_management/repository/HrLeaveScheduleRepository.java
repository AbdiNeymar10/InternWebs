package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HrLeaveScheduleRepository extends JpaRepository<HrLeaveSchedule, Long> {
    List<HrLeaveSchedule> findByEmployeeIdAndLeaveYearId(String employeeId, Long leaveYearId);
}