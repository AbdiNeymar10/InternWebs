package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HrLeaveBalanceRepository extends JpaRepository<HrLeaveBalance, Long> {
    @Query("SELECT h FROM HrLeaveBalance h WHERE h.employeeId = :employeeId AND h.leaveYear.id = :leaveYearId AND h.leaveType.id = :leaveTypeId")
    HrLeaveBalance findByEmployeeIdAndLeaveYearIdAndLeaveTypeId(
            @Param("employeeId") String employeeId,
            @Param("leaveYearId") Long leaveYearId,
            @Param("leaveTypeId") Long leaveTypeId
    );
}