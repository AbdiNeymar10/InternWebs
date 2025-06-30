package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HrLeaveSettingRepository extends JpaRepository<HrLeaveSetting, Long> {
    List<HrLeaveSetting> findByLeaveType_Id(Long leaveTypeId);
}