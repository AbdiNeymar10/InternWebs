package com.example.employee_management.service;

import com.example.employee_management.dto.LeaveRequestDTO;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.HrLeaveBalance;
import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.entity.HrLuLeaveYear;
import com.example.employee_management.entity.LeaveRequest;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.EmployeeRepository;
import com.example.employee_management.repository.HrLeaveBalanceRepository;
import com.example.employee_management.repository.HrLuLeaveTypeRepository;
import com.example.employee_management.repository.HrLuLeaveYearRepository;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaveRequestService {

    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestService.class);
    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final HrLuLeaveTypeRepository hrLuLeaveTypeRepository;
    private final HrLeaveBalanceRepository leaveBalanceRepository;
    private final HrLuLeaveYearRepository hrLuLeaveYearRepository;

    @Autowired
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository,
                               EmployeeRepository employeeRepository,
                               HrLuLeaveTypeRepository hrLuLeaveTypeRepository,
                               HrLeaveBalanceRepository leaveBalanceRepository,
                               HrLuLeaveYearRepository hrLuLeaveYearRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.hrLuLeaveTypeRepository = hrLuLeaveTypeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.hrLuLeaveYearRepository = hrLuLeaveYearRepository;
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

    @Transactional(readOnly = true)
    public List<LeaveRequest> getApprovedAndCurrentOrUpcomingLeaves() {
        String todayDateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
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
        leaveRequest.setApprovedDays(0.0);

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
        request.setHrStatus("Pending");

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
                request.setApprovedDays(approvedDaysFromDept);
            } else {
                logger.warn("approvedDaysFromDept is null or negative for approved request ID: {}. Falling back to currentRequestedDays.", requestId);
                request.setApprovedDays((double) currentRequestedDays);
            }
        } else if ("Rejected".equalsIgnoreCase(status)) {
            request.setApprovedDays(0.0);
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

        if (!"Approved".equalsIgnoreCase(request.getDeptStatus()) && "Approved".equalsIgnoreCase(status)) {
            logger.error("HR cannot approve request ID: {} because department status is not 'Approved'. Current deptStatus: {}", requestId, request.getDeptStatus());
            throw new IllegalArgumentException("Department must approve the request before HR can approve it.");
        }

        if ("Approved".equalsIgnoreCase(status)) {
            if (approvedDays == null || approvedDays <= 0) {
                logger.error("Approved days must be > 0 for an approved HR status. Received: {} for request ID: {}", approvedDays, requestId);
                throw new IllegalArgumentException("Approved days must be greater than 0 for an approved HR status.");
            }
            double maxAllowedByRequested = (request.getRequestedDays() != null) ? request.getRequestedDays() : 0f;

            if (approvedDays > maxAllowedByRequested) {
                logger.error("HR Approved days ({}) cannot exceed original requested days ({}) for request ID: {}", approvedDays, maxAllowedByRequested, requestId);
                throw new IllegalArgumentException("HR Approved days (" + approvedDays + ") cannot exceed original requested days (" + maxAllowedByRequested + ").");
            }
            request.setApprovedDays(approvedDays);

            // Deduct from leave balance on final HR approval
            deductFromLeaveBalance(request, approvedDays);
        } else if ("Rejected".equalsIgnoreCase(status)) {
            request.setApprovedDays(0.0);
        }

        request.setHrStatus(status);

        if (remark != null && !remark.isEmpty()) {
            request.setRemark(remark);
        } else if ("Rejected".equalsIgnoreCase(status)) {
            if (remark == null || remark.trim().isEmpty()) {
                logger.error("Remark is required for HR rejection of request ID: {}", requestId);
                throw new IllegalArgumentException("Remark is required for rejection.");
            }
        }

        logger.debug("Request state before HR save for ID {}: HrStatus={}, ApprovedDays={}",
                requestId, request.getHrStatus(), request.getApprovedDays());
        return leaveRequestRepository.save(request);
    }

    private void deductFromLeaveBalance(LeaveRequest request, Double approvedDays) {
        // Parse the leave start date to determine the year (assuming format "yyyy-MM-dd")
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(request.getLeaveStart(), formatter);
        String yearStr = String.valueOf(startDate.getYear()); // Convert int year to String

        // Find the HrLuLeaveYear by lyear
        Optional<HrLuLeaveYear> leaveYearOptional = hrLuLeaveYearRepository.findByLyear(yearStr);
        HrLuLeaveYear leaveYear = leaveYearOptional.orElseThrow(() -> {
            logger.error("Leave year not found for year: {}", yearStr);
            return new ResourceNotFoundException("Leave year not found for " + yearStr);
        });

        String empId = request.getEmployee().getEmpId();
        Long leaveTypeId = request.getLeaveType().getId();

        // Find the leave balance
        HrLeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveYearIdAndLeaveTypeId(empId, leaveYear.getId(), leaveTypeId);
        if (balance == null) {
            logger.error("Leave balance not found for employee: {}, year: {}, type: {}", empId, yearStr, leaveTypeId);
            throw new ResourceNotFoundException("Leave balance not found for employee " + empId + " in year " + yearStr + " for leave type " + leaveTypeId);
        }

        float approvedFloat = approvedDays.floatValue();
        float currentRemaining = balance.getRemainingDays() != null ? balance.getRemainingDays() : 0.0f;
        float newRemaining = currentRemaining - approvedFloat;

        // Prevent negative balance
        if (newRemaining < 0) {
            logger.error("Not enough leave balance for request ID: {}. Remaining: {}, Approved: {}", request.getId(), currentRemaining, approvedFloat);
            throw new IllegalArgumentException("Not enough leave balance. Remaining: " + currentRemaining + ", Requested: " + approvedFloat);
        }

        // Update balance
        balance.setRemainingDays(newRemaining);
        float currentUsed = balance.getUsedDays() != null ? balance.getUsedDays() : 0.0f;
        balance.setUsedDays(currentUsed + approvedFloat);

        leaveBalanceRepository.save(balance);
        logger.info("Deducted {} days from leave balance for employee: {}, year: {}, type: {}. New remaining: {}", approvedFloat, empId, yearStr, leaveTypeId, newRemaining);
    }
}