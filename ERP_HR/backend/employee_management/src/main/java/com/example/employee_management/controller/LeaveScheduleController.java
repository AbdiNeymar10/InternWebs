package com.example.employee_management.controller;

import com.example.employee_management.dto.LeaveScheduleDTO;
import com.example.employee_management.service.LeaveScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave/schedule") // New base path for leave schedules
public class LeaveScheduleController {

    private static final Logger logger = LoggerFactory.getLogger(LeaveScheduleController.class);
    private final LeaveScheduleService leaveScheduleService;

    @Autowired
    public LeaveScheduleController(LeaveScheduleService leaveScheduleService) {
        this.leaveScheduleService = leaveScheduleService;
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Map<String, Object>> getSchedulesByEmployeeId(@PathVariable String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            logger.warn("getSchedulesByEmployeeId called with empty employeeId");
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Employee ID cannot be empty"));
        }
        try {
            List<LeaveScheduleDTO> schedules = leaveScheduleService.getLeaveSchedulesByEmployeeId(employeeId);
            if (schedules.isEmpty()) {
                logger.info("No leave schedules found for employee {}. Returning empty list.", employeeId);
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of(
                                "status", "success",
                                "message", "No leave schedules found for employee " + employeeId + ".",
                                "data", List.of() // Return empty list in data
                        ));
            }
            logger.info("Found {} leave schedules for employee {}", schedules.size(), employeeId);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "success", "data", schedules));
        } catch (Exception e) {
            logger.error("Error fetching leave schedules for employeeId {}: Type: {}, Message: {}",
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
}