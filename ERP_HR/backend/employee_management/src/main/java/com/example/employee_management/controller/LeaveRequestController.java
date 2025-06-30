package com.example.employee_management.controller;

import com.example.employee_management.dto.*;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.entity.LeaveRequest;
import com.example.employee_management.service.LeaveRequestService;
import com.example.employee_management.service.LeaveScheduleService;
import com.example.employee_management.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leave") // Existing base path for leave-related operations
public class LeaveRequestController {

    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestController.class);

    private final LeaveRequestService leaveRequestService;
    private final NotificationService notificationService;
    private final LeaveScheduleService leaveScheduleService; // Inject LeaveScheduleService

    @Autowired
    public LeaveRequestController(LeaveRequestService leaveRequestService,
                                  NotificationService notificationService,
                                  LeaveScheduleService leaveScheduleService) { // Add to constructor
        this.leaveRequestService = leaveRequestService;
        this.notificationService = notificationService;
        this.leaveScheduleService = leaveScheduleService; // Initialize
    }

    // Helper method to convert LeaveRequest to a Map for the response
    private Map<String, Object> convertLeaveRequestToMap(LeaveRequest request) {
        if (request == null) {
            logger.warn("Attempted to convert a null LeaveRequest object to map.");
            return Collections.emptyMap();
        }

        Map<String, Object> leaveTypeDetails = new HashMap<>();
        if (request.getLeaveType() != null) {
            HrLuLeaveType actualLeaveType = request.getLeaveType();
            leaveTypeDetails.put("id", actualLeaveType.getId());
            leaveTypeDetails.put("leaveName", actualLeaveType.getLeaveName());
        } else {
            logger.warn("LeaveRequest ID {} has a null leaveType object. LEAVE_TYPE_ID might be missing or invalid.", request.getId());
            leaveTypeDetails.put("id", -1L); // Or some other indicator of missing data
            leaveTypeDetails.put("leaveName", "N/A (Type Not Loaded)");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", request.getId() != null ? request.getId().toString() : null);

        if (request.getEmployee() != null) {
            Map<String, Object> employeeMap = new HashMap<>();
            Employee employee = request.getEmployee();
            employeeMap.put("empId", employee.getEmpId());
            employeeMap.put("firstName", employee.getFirstName());
            employeeMap.put("lastName", employee.getLastName());
            // Include department if needed, ensure it's handled if deptId is an object or just an ID
            employeeMap.put("department", employee.getDeptId() != null ? employee.getDeptId().toString() : null);
            result.put("employee", employeeMap);
        } else {
            logger.warn("LeaveRequest ID {} has a null employee object.", request.getId());
            result.put("employee", null); // Or an empty map
        }

        result.put("leaveType", leaveTypeDetails);
        result.put("incidentType", request.getIncidentType() != null ? request.getIncidentType() : "N/A");
        result.put("leaveStart", request.getLeaveStart());
        result.put("leaveEnd", request.getLeaveEnd());
        result.put("requestedDays", request.getRequestedDays() != null ? request.getRequestedDays() : 0f);
        result.put("dayType", request.getDayType() != null ? request.getDayType() : "N/A");
        result.put("description", request.getDescription() != null ? request.getDescription() : "");
        result.put("deptStatus", request.getDeptStatus() != null ? request.getDeptStatus() : "Pending");
        result.put("hrStatus", request.getHrStatus() != null ? request.getHrStatus() : "Pending");
        result.put("approvedDays", request.getApprovedDays() != null ? request.getApprovedDays() : 0.0); // Ensure this is double
        result.put("remark", request.getRemark() != null ? request.getRemark() : "");

        // For overall status display on frontend if needed
        String currentOverallStatus = "Pending";
        if (request.getHrStatus() != null && !"Pending".equalsIgnoreCase(request.getHrStatus())) {
            currentOverallStatus = request.getHrStatus(); // HR status is final
        } else if (request.getDeptStatus() != null && !"Pending".equalsIgnoreCase(request.getDeptStatus())) {
            if ("Approved".equalsIgnoreCase(request.getDeptStatus())) {
                currentOverallStatus = "Pending HR Approval";
            } else { // Rejected by Dept
                currentOverallStatus = request.getDeptStatus();
            }
        }
        result.put("status", currentOverallStatus); // General status for easier frontend display
        result.put("employeeId", request.getEmployee() != null ? request.getEmployee().getEmpId() : null);
        result.put("leaveTypeId", request.getLeaveType() != null ? request.getLeaveType().getId() : null);


        return result;
    }

    private List<Map<String, Object>> convertLeaveRequestListToMapList(List<LeaveRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }
        return requests.stream()
                .map(this::convertLeaveRequestToMap)
                .collect(Collectors.toList());
    }

    @PostMapping("/request")
    public ResponseEntity<?> createLeaveRequest(@RequestBody LeaveRequestDTO leaveRequestDTO) {
        try {
            LeaveRequest createdRequest = leaveRequestService.createLeaveRequest(leaveRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertLeaveRequestToMap(createdRequest));
        } catch (ResourceNotFoundException ex) {
            logger.error("Resource not found while creating leave request: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        } catch (IllegalArgumentException ex) {
            logger.error("Illegal argument while creating leave request: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        } catch (Exception ex) {
            logger.error("Error creating leave request", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create leave request: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"), "status", "error"));
        }
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<?> getEmployee(@PathVariable String empId) {
        try {
            Employee employee = leaveRequestService.getEmployeeById(empId);
            Map<String, Object> employeeData = new HashMap<>();
            employeeData.put("empId", employee.getEmpId());
            employeeData.put("firstName", employee.getFirstName());
            employeeData.put("lastName", employee.getLastName());
            employeeData.put("department", employee.getDeptId() != null ? employee.getDeptId().toString() : null);
            return ResponseEntity.ok(employeeData);
        } catch (ResourceNotFoundException ex) {
            logger.warn("Employee not found with empId {}: {}", empId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        } catch (Exception ex) {
            logger.error("Error fetching employee with empId {}", empId, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching employee: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"), "status", "error"));
        }
    }


    @GetMapping("/employee/{empId}/requests")
    public ResponseEntity<?> getLeaveRequestsByEmployee(@PathVariable String empId) {
        try {
            logger.info("Fetching leave requests for employee ID: {}", empId);
            List<LeaveRequest> requests = leaveRequestService.getLeaveRequestsByEmployee(empId);
            if (requests == null) {
                logger.warn("LeaveRequestService returned null for empId: {}", empId);
                return ResponseEntity.ok(Collections.emptyList());
            }
            logger.info("Found {} leave requests for employee ID: {}", requests.size(), empId);
            List<Map<String, Object>> responseData = convertLeaveRequestListToMapList(requests);
            return ResponseEntity.ok(responseData);
        } catch (ResourceNotFoundException ex) {
            logger.warn("Resource not found when fetching leave requests for empId {}: {}", empId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        } catch (Exception ex) {
            logger.error("Error fetching leave requests for empId {}", empId, ex);
            String errorMessage = ex.getMessage() != null ? ex.getMessage() : "An internal server error occurred while fetching leave requests.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching leave requests: " + errorMessage, "status", "error"));
        }
    }

    @GetMapping("/request/pending/dept")
    public ResponseEntity<List<Map<String, Object>>> getPendingDepartmentApprovals() {
        try {
            List<LeaveRequest> requests = leaveRequestService.getPendingDepartmentApprovals();
            return ResponseEntity.ok(convertLeaveRequestListToMapList(requests));
        } catch (Exception ex) {
            logger.error("Error fetching pending department approvals", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Failed to fetch pending department approvals: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"))));
        }
    }

    @GetMapping("/request/pending/hr")
    public ResponseEntity<List<Map<String, Object>>> getPendingHRApprovals() {
        try {
            List<LeaveRequest> requests = leaveRequestService.getPendingHRApprovals();
            return ResponseEntity.ok(convertLeaveRequestListToMapList(requests));
        } catch (Exception ex) {
            logger.error("Error fetching pending HR approvals", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Failed to fetch pending HR approvals: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"))));
        }
    }

    // Endpoint for "Employees on Leave"
    @GetMapping("/request/approved-current")
    public ResponseEntity<List<Map<String, Object>>> getApprovedAndCurrentOrUpcomingLeaves() {
        try {
            List<LeaveRequest> onLeave = leaveRequestService.getApprovedAndCurrentOrUpcomingLeaves();
            return ResponseEntity.ok(convertLeaveRequestListToMapList(onLeave));
        } catch (Exception ex) {
            logger.error("Error fetching approved and current/upcoming leaves", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Error fetching employees on leave: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"))));
        }
    }

    @PutMapping("/request/approve/dept/{requestId}")
    public ResponseEntity<?> approveDepartmentRequest(
            @PathVariable Long requestId,
            @RequestBody DepartmentApprovalDTO approvalDTO) {
        try {
            LeaveRequest request = leaveRequestService.updateDepartmentStatus(
                    requestId,
                    approvalDTO.getStatus(),
                    approvalDTO.getRemark(),
                    approvalDTO.getApprovedDays(),
                    approvalDTO.getLeaveStart(),
                    approvalDTO.getLeaveEnd(),
                    approvalDTO.getRequestedDays()
            );
            return ResponseEntity.ok(convertLeaveRequestToMap(request));
        } catch (ResourceNotFoundException ex) {
            logger.warn("Leave request not found for department approval (ID {}): {}", requestId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        } catch (IllegalArgumentException ex) {
            logger.warn("Invalid argument for department approval (ID {}): {}", requestId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        }
        catch (Exception ex) {
            logger.error("Error updating department status for request ID {}", requestId, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update department status: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"), "status", "error"));
        }
    }

    @PutMapping("/request/approve/hr/{requestId}")
    public ResponseEntity<?> approveHRRequest(
            @PathVariable Long requestId,
            @RequestBody HrApprovalDTO approvalDTO) {
        try {
            LeaveRequest request = leaveRequestService.updateHRStatus(
                    requestId,
                    approvalDTO.getStatus(),
                    approvalDTO.getApprovedDays(),
                    approvalDTO.getRemark()
            );
            return ResponseEntity.ok(convertLeaveRequestToMap(request));
        } catch (ResourceNotFoundException ex) {
            logger.warn("Leave request not found for HR approval (ID {}): {}", requestId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        } catch (IllegalArgumentException ex) {
            logger.warn("Invalid argument for HR approval (ID {}): {}", requestId, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage(), "status", "error"));
        }
        catch (Exception ex) {
            logger.error("Error updating HR status for request ID {}", requestId, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update HR status: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"), "status", "error"));
        }
    }

    @GetMapping("/request/history/dept")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentProcessedHistory() {
        try {
            List<LeaveRequest> history = leaveRequestService.getDepartmentProcessedHistory();
            return ResponseEntity.ok(convertLeaveRequestListToMapList(history));
        } catch (Exception ex) {
            logger.error("Error fetching department processed history", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Error fetching department history: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"))));
        }
    }

    @GetMapping("/request/history/hr")
    public ResponseEntity<List<Map<String, Object>>> getHrProcessedHistory() {
        try {
            List<LeaveRequest> history = leaveRequestService.getHrProcessedHistory();
            return ResponseEntity.ok(convertLeaveRequestListToMapList(history));
        } catch (Exception ex) {
            logger.error("Error fetching HR processed history", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "Error fetching HR history: " + (ex.getMessage() != null ? ex.getMessage() : "Internal Server Error"))));
        }
    }

    @GetMapping("/schedules/employee/{employeeId}")
    public ResponseEntity<Map<String, Object>> getEmployeeLeaveSchedules(@PathVariable String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            logger.warn("getEmployeeLeaveSchedules called with empty employeeId");
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Employee ID cannot be empty"));
        }
        try {
            List<LeaveScheduleDTO> schedules = leaveScheduleService.getLeaveSchedulesByEmployeeId(employeeId);
            if (schedules.isEmpty()) {
                logger.info("No leave schedules found for employee {} via LeaveRequestController. Returning empty list.", employeeId);
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of(
                                "status", "success",
                                "message", "No leave schedules found for employee " + employeeId + ".",
                                "data", List.of()
                        ));
            }
            logger.info("Found {} leave schedules for employee {} via LeaveRequestController", schedules.size(), employeeId);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "success", "data", schedules));
        } catch (Exception e) {
            logger.error("Error fetching leave schedules for employeeId {} via LeaveRequestController: Type: {}, Message: {}",
                    employeeId, e.getClass().getName(), e.getMessage(), e);
            String errorMessage = "An unexpected error occurred while fetching leave schedules.";
            if (e.getMessage() != null) {
                errorMessage += " Error: " + e.getMessage();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", errorMessage));
        }
    }

    @PostMapping("/notify/submission")
    public ResponseEntity<?> notifyLeaveSubmission(@RequestBody EmailNotificationRequestDTO emailDetails) {
        try {
            notificationService.sendLeaveSubmissionNotification(emailDetails);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Email notification request processed."));
        } catch (Exception e) {
            logger.error("Error processing email notification request for submission", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Failed to process email notification request: " + (e.getMessage() != null ? e.getMessage() : "Internal Server Error")));
        }
    }
}