package com.example.employee_management.controller;

import com.example.employee_management.dto.LeaveHistoryDto;
import com.example.employee_management.service.LeaveHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave/history")
public class LeaveHistoryController {

    private final LeaveHistoryService leaveHistoryService;

    @Autowired
    public LeaveHistoryController(LeaveHistoryService leaveHistoryService) {
        this.leaveHistoryService = leaveHistoryService;
    }

    @GetMapping("/{empId}")
    public ResponseEntity<Map<String, Object>> getLeaveHistoryByEmployeeId(@PathVariable String empId) {
        if (empId == null || empId.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Employee ID (empId) cannot be empty"));
        }
        try {
            List<LeaveHistoryDto> history = leaveHistoryService.getLeaveHistoryByEmployeeId(empId);
            if (history.isEmpty()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("status", "success", "message", "No leave history found", "data", List.of()));
            }
            return ResponseEntity.ok(Map.of("status", "success", "data", history));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Error fetching leave history: " + e.getMessage()));
        }
    }

    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> createLeaveHistory(@RequestBody LeaveHistoryDto leaveHistoryDto) {
        try {
            LeaveHistoryDto createdHistory = leaveHistoryService.createLeaveHistory(leaveHistoryDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "success", "data", createdHistory));
        } catch (RuntimeException e) { // Catch specific exceptions like IllegalArgumentException from service
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Error creating leave history: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false, defaultValue = "false") boolean isHrApproval) {
        try {
            LeaveHistoryDto updatedHistory = leaveHistoryService.updateLeaveStatus(id, status, isHrApproval);
            return ResponseEntity.ok(Map.of("status", "success", "data", updatedHistory));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("status", "error", "message", e.getMessage()));
            }
            // Catch other runtime exceptions from service (like invalid status)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // Or INTERNAL_SERVER_ERROR depending on the nature
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Error updating leave status: " + e.getMessage()));
        }
    }
}