package com.example.employee_management.repository;

import com.example.employee_management.entity.LeaveRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @EntityGraph(attributePaths = {"employee", "leaveType"})
    List<LeaveRequest> findByEmployeeEmpId(String empId);

    @EntityGraph(attributePaths = {"employee", "leaveType"})
    List<LeaveRequest> findByDeptStatus(String status);

    @EntityGraph(attributePaths = {"employee", "leaveType"})
    List<LeaveRequest> findByHrStatus(String status);

    @EntityGraph(attributePaths = {"employee", "leaveType"})
    List<LeaveRequest> findByDeptStatusIn(List<String> statuses);

    @EntityGraph(attributePaths = {"employee", "leaveType"})
    List<LeaveRequest> findByHrStatusIn(List<String> statuses);

    // This is the key method for the "On Leave" section
    @EntityGraph(attributePaths = {"employee", "leaveType"})
    List<LeaveRequest> findByHrStatusAndLeaveEndGreaterThanEqual(String hrStatus, String leaveEndDate);
}
   