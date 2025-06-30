package com.example.employee_management.repository;

import com.example.employee_management.entity.LeaveSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveScheduleRepository extends JpaRepository<LeaveSchedule, Long> {

    // Find schedules by the employee's business ID (empId)
    List<LeaveSchedule> findByEmployeeId(String employeeId);

    // Optional: If you want to filter by year as well
    // List<LeaveSchedule> findByEmployeeIdAndLeaveYearId(String employeeId, Long leaveYearId);
}