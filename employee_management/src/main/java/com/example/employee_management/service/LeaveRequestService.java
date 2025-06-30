package com.example.employee_management.service;

import com.example.employee_management.dto.LeaveRequestDTO;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.entity.LeaveRequest;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.EmployeeRepository;
import com.example.employee_management.repository.HrLuLeaveTypeRepository;
import com.example.employee_management.repository.LeaveRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestService.class);
    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final HrLuLeaveTypeRepository hrLuLeaveTypeRepository;

    @Autowired
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository,
                               EmployeeRepository employeeRepository,
                               HrLuLeaveTypeRepository hrLuLeaveTypeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.hrLuLeaveTypeRepository = hrLuLeaveTypeRepository;
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(String empId) {
        return employeeRepository.findByEmpIdIgnoreCase(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with empId: " + empId));
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getDepartmentProcessedHistory() {
        return leaveRequestRepository.findByDeptStatusIn(Arrays.asList("Approved", "Rejected"));
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getHrProcessedHistory() {
        return leaveRequestRepository.findByHrStatusIn(Arrays.asList("Approved", "Rejected"));
    }

    // This service method provides the data for the "On Leave" section
    @Transactional(readOnly = true)
    public List<LeaveRequest> getApprovedAndCurrentOrUpcomingLeaves() {
        String todayDateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        // Fetches leaves that are "Approved" by HR and are current or upcoming
        return leaveRequestRepository.findByHrStatusAndLeaveEndGreaterThanEqual("Approved", todayDateStr);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByEmployee(String empId) {
        if (empId == null || empId.trim().isEmpty()) {
            logger.warn("getLeaveRequestsByEmployee called with null or empty empId");
            return List.of();
        }
        logger.info("Fetching leave requests for employee empId: {}", empId);
        List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeEmpId(empId);
        logger.info("Found {} leave requests for employee empId: {}", requests.size(), empId);
        return requests;
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingDepartmentApprovals() {
        return leaveRequestRepository.findByDeptStatus("Pending");
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingHRApprovals() {
        // Fetch requests that are Department Approved AND HR Pending
        return leaveRequestRepository.findByDeptStatus("Approved")
                .stream()
                .filter(req -> "Pending".equalsIgnoreCase(req.getHrStatus()))
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequest createLeaveRequest(LeaveRequestDTO leaveRequestDTO) {
        logger.info("Creating leave request for employeeId: {}", leaveRequestDTO.getEmployeeId());

        Employee employee = employeeRepository.findByEmpIdIgnoreCase(leaveRequestDTO.getEmployeeId())
                .orElseThrow(() -> {
                    logger.error("Employee not found with ID: {}", leaveRequestDTO.getEmployeeId());
                    return new ResourceNotFoundException("Employee not found with ID: " + leaveRequestDTO.getEmployeeId());
                });

        HrLuLeaveType leaveType = null;
        if (leaveRequestDTO.getLeaveTypeId() != null) {
            leaveType = hrLuLeaveTypeRepository.findById(leaveRequestDTO.getLeaveTypeId())
                    .orElseThrow(() -> {
                        logger.error("LeaveType not found with ID: {}", leaveRequestDTO.getLeaveTypeId());
                        return new ResourceNotFoundException("LeaveType not found with ID: " + leaveRequestDTO.getLeaveTypeId());
                    });
        } else {
            logger.error("LeaveTypeId is null for new leave request for employeeId: {}", leaveRequestDTO.getEmployeeId());
            throw new IllegalArgumentException("Leave Type ID cannot be null.");
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(leaveType);
        leaveRequest.setLeaveStart(leaveRequestDTO.getLeaveStart());
        leaveRequest.setLeaveEnd(leaveRequestDTO.getLeaveEnd());
        leaveRequest.setRequestedDays(leaveRequestDTO.getRequestedDays());
        leaveRequest.setDayType(leaveRequestDTO.getDayType());
        leaveRequest.setDescription(leaveRequestDTO.getDescription());
        leaveRequest.setIncidentType(leaveRequestDTO.getIncidentType());

        leaveRequest.setDeptStatus("Pending");
        leaveRequest.setHrStatus("Pending");
        leaveRequest.setApprovedDays(0.0); // Default to 0

        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        logger.info("Leave request created successfully with ID: {}", savedRequest.getId());
        return savedRequest;
    }

    @Transactional
    public LeaveRequest updateDepartmentStatus(Long requestId, String status, String remark, Double approvedDaysFromDept, String newLeaveStart, String newLeaveEnd, Float newRequestedDays) {
        logger.info("Updating department status for request ID: {}. Status: {}, ApprovedDays: {}, Start: {}, End: {}, ReqDays: {}",
                requestId, status, approvedDaysFromDept, newLeaveStart, newLeaveEnd, newRequestedDays);

        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> {
                    logger.error("Leave request not found with ID: {}", requestId);
                    return new ResourceNotFoundException("Leave request not found with ID: " + requestId);
                });

        if (status == null || (!status.equalsIgnoreCase("Approved") && !status.equalsIgnoreCase("Rejected"))) {
            logger.error("Invalid status value: {} for request ID: {}", status, requestId);
            throw new IllegalArgumentException("Invalid status value: " + status + ". Must be 'Approved' or 'Rejected'.");
        }

        request.setDeptStatus(status);
        if (remark != null && !remark.isEmpty()) {
            request.setRemark(remark);
        }
        request.setHrStatus("Pending"); // Always reset HR status to Pending when department acts

        // Update leave details if they have changed
        if (newLeaveStart != null && !newLeaveStart.equals(request.getLeaveStart())) {
            logger.debug("Updating leaveStart from {} to {} for request ID: {}", request.getLeaveStart(), newLeaveStart, requestId);
            request.setLeaveStart(newLeaveStart);
        }
        if (newLeaveEnd != null && !newLeaveEnd.equals(request.getLeaveEnd())) {
            logger.debug("Updating leaveEnd from {} to {} for request ID: {}", request.getLeaveEnd(), newLeaveEnd, requestId);
            request.setLeaveEnd(newLeaveEnd);
        }
        if (newRequestedDays != null && !newRequestedDays.equals(request.getRequestedDays())) {
            logger.debug("Updating requestedDays from {} to {} for request ID: {}", request.getRequestedDays(), newRequestedDays, requestId);
            request.setRequestedDays(newRequestedDays);
        }


        if ("Approved".equalsIgnoreCase(status)) {
            float currentRequestedDays = (request.getRequestedDays() != null) ? request.getRequestedDays() : 0f;
            if (approvedDaysFromDept != null && approvedDaysFromDept >= 0) {
                if (approvedDaysFromDept > currentRequestedDays) {
                    logger.error("Approved days ({}) cannot exceed requested days ({}) for request ID: {}", approvedDaysFromDept, currentRequestedDays, requestId);
                    throw new IllegalArgumentException("Approved days (" + approvedDaysFromDept + ") cannot exceed requested days (" + currentRequestedDays + ").");
                }
                // Department sets their approved days
                request.setApprovedDays(approvedDaysFromDept);
            } else {
                // If department approves but doesn't specify approved days (e.g. UI doesn't send it),
                // default to the (potentially updated) requested days.
                logger.warn("approvedDaysFromDept is null or negative for approved request ID: {}. Falling back to currentRequestedDays.", requestId);
                request.setApprovedDays((double) currentRequestedDays);
            }
        } else if ("Rejected".equalsIgnoreCase(status)) {
            request.setApprovedDays(0.0); // Explicitly set to 0 for rejected
        }
        logger.debug("Request state before save for ID {}: DeptStatus={}, HrStatus={}, ApprovedDays={}",
                requestId, request.getDeptStatus(), request.getHrStatus(), request.getApprovedDays());
        return leaveRequestRepository.save(request);
    }

    @Transactional
    public LeaveRequest updateHRStatus(Long requestId, String status, Double approvedDays, String remark) {
        logger.info("Updating HR status for request ID: {}. Status: {}, ApprovedDays: {}", requestId, status, approvedDays);
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> {
                    logger.error("Leave request not found with ID: {}", requestId);
                    return new ResourceNotFoundException("Leave request not found with ID: " + requestId);
                });

        if (status == null || (!status.equalsIgnoreCase("Approved") && !status.equalsIgnoreCase("Rejected"))) {
            logger.error("Invalid HR status value: {} for request ID: {}", status, requestId);
            throw new IllegalArgumentException("Invalid HR status value: " + status + ". Must be 'Approved' or 'Rejected'.");
        }

        // Ensure department has approved before HR can approve
        // HR can still reject a request that is pending department approval if needed,
        // but approval requires department approval first.
        if (!"Approved".equalsIgnoreCase(request.getDeptStatus()) && "Approved".equalsIgnoreCase(status)) {
            logger.error("HR cannot approve request ID: {} because department status is not 'Approved'. Current deptStatus: {}", requestId, request.getDeptStatus());
            throw new IllegalArgumentException("Department must approve the request before HR can approve it.");
        }


        if ("Approved".equalsIgnoreCase(status)) {
            if (approvedDays == null || approvedDays <= 0) {
                logger.error("Approved days must be > 0 for an approved HR status. Received: {} for request ID: {}", approvedDays, requestId);
                throw new IllegalArgumentException("Approved days must be greater than 0 for an approved HR status.");
            }
            // --- MODIFIED VALIDATION LOGIC ---
            // HR's approved days should not exceed the original requested days.
            // We ignore the department's approvedDays for this check, as HR is the final approver
            // and their decision on days should be capped by the original request.
            double maxAllowedByRequested = (request.getRequestedDays() != null) ? request.getRequestedDays() : 0f;

            if (approvedDays > maxAllowedByRequested) {
                logger.error("HR Approved days ({}) cannot exceed original requested days ({}) for request ID: {}", approvedDays, maxAllowedByRequested, requestId);
                throw new IllegalArgumentException("HR Approved days (" + approvedDays + ") cannot exceed original requested days (" + maxAllowedByRequested + ").");
            }
            // HR sets the final approved days
            request.setApprovedDays(approvedDays);
        } else if ("Rejected".equalsIgnoreCase(status)) {
            request.setApprovedDays(0.0); // If HR rejects, approved days are 0
        }

        // Set HR status
        request.setHrStatus(status);

        // HR can add/override remarks
        if (remark != null && !remark.isEmpty()) {
            request.setRemark(remark);
        } else if ("Rejected".equalsIgnoreCase(status)) {
            // If HR rejects, remark is required (handled by frontend validation, but good practice here too)
            // Although the frontend requires it, the backend should also validate if remark is empty on rejection
            if (remark == null || remark.trim().isEmpty()) {
                logger.error("Remark is required for HR rejection of request ID: {}", requestId);
                throw new IllegalArgumentException("Remark is required for rejection.");
            }
        }


        logger.debug("Request state before HR save for ID {}: HrStatus={}, ApprovedDays={}",
                requestId, request.getHrStatus(), request.getApprovedDays());
        return leaveRequestRepository.save(request);
    }
}