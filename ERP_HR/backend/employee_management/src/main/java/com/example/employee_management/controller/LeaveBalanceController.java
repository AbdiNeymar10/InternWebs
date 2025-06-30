package com.example.employee_management.controller;

import com.example.employee_management.dto.LeaveBalanceDTO; // Assuming this DTO is in this package
import com.example.employee_management.dto.LeaveBalanceUpdateDTO; // Assuming this DTO is in this package
import com.example.employee_management.entity.HrLeaveBalance;
import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.entity.HrLuLeaveYear;
// Assuming this model exists
import com.example.employee_management.service.LeaveBalanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave") // Using the more general base path
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveBalanceController {

    private static final Logger logger = LoggerFactory.getLogger(LeaveBalanceController.class);
    private final LeaveBalanceService leaveBalanceService;

    @Autowired
    public LeaveBalanceController(LeaveBalanceService leaveBalanceService) {
        this.leaveBalanceService = leaveBalanceService;
    }

    // --- Endpoints from the first controller (prefixed with /balance) ---

    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<Map<String, Object>> getEmployeeLeaveBalanceSummary(@PathVariable String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            logger.warn("getEmployeeLeaveBalanceSummary called with empty employeeId");
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", "Employee ID cannot be empty"));
        }
        try {
            // Assuming leaveBalanceService has this method
            Optional<HrLeaveBalance> balanceOptional = leaveBalanceService.getBalanceByEmployeeId(employeeId);

            if (balanceOptional.isEmpty()) {
                logger.info("No active leave balance summary found for employee {}. Returning default structure.", employeeId);
                Map<String, Object> defaultData = new HashMap<>();
                defaultData.put("balanceId", null);
                defaultData.put("initialBalance", 0.0f);
                defaultData.put("currentBalance", 0.0f); // This is "remaining" for frontend
                defaultData.put("usedDays", 0.0f);
                defaultData.put("leaveYear", Year.now().getValue());

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of(
                                "status", "success",
                                "message", "No active leave balance summary found for employee " + employeeId + ".",
                                "data", defaultData
                        ));
            }

            HrLeaveBalance balance = balanceOptional.get();
            logger.info("Leave balance summary found for employee {}: ID={}, DB_InitialBalance={}, DB_CurrentBalance(Remaining)={}, DB_UsedDays={}",
                    employeeId, balance.getBalanceId(), balance.getInitialBalance(),
                    balance.getCurrentBalance(), // Using currentBalance from DB
                    balance.getUsedDays());

            Map<String, Object> balanceData = new HashMap<>();
            balanceData.put("balanceId", balance.getBalanceId());
            balanceData.put("initialBalance", balance.getInitialBalance() != null ? balance.getInitialBalance() : 0.0f);
            balanceData.put("currentBalance", balance.getCurrentBalance() != null ? balance.getCurrentBalance() : 0.0f);
            balanceData.put("usedDays", balance.getUsedDays() != null ? balance.getUsedDays() : 0.0f);
            balanceData.put("leaveYear", balance.getLeaveYear() != null ? balance.getLeaveYear() : Year.now().getValue());

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "status", "success",
                            "data", balanceData
                    ));
        } catch (Exception e) {
            logger.error("Error fetching leave balance summary for employeeId {}: Type: {}, Message: {}",
                    employeeId, e.getClass().getName(), e.getMessage(), e);
            String errorMessage = "An unexpected error occurred while fetching leave balance summary. Please check server logs for details.";
            if (e.getMessage() != null) {
                errorMessage += " Error: " + e.getMessage();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("status", "error", "message", errorMessage));
        }
    }

    @GetMapping("/balance/history/{employeeId}")
    public ResponseEntity<?> getBalanceHistory(@PathVariable String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Employee ID cannot be empty"));
        }
        try {
            // Assuming leaveBalanceService has this method
            List<HrLeaveBalance> history = leaveBalanceService.getBalanceHistory(employeeId);
            if (history.isEmpty()) {
                return ResponseEntity.ok()
                        .body(Map.of("status", "success", "message", "No balance history found", "data", List.of()));
            }
            return ResponseEntity.ok(Map.of("status", "success", "data", history));
        } catch (Exception e) {
            logger.error("Error fetching balance history for {}: {}", employeeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Error fetching balance history: " + e.getMessage()));
        }
    }

    @PutMapping("/balance/{id}")
    public ResponseEntity<?> updateLeaveBalance(
            @PathVariable Long id,
            @RequestBody LeaveBalanceUpdateDTO updateDTO) {
        try {
            // Assuming leaveBalanceService has this method
            HrLeaveBalance updated = leaveBalanceService.updateBalance(id, updateDTO);
            return ResponseEntity.ok(Map.of("status", "success", "data", updated));
        } catch (RuntimeException e) {
            logger.error("Error updating leave balance for ID {}: {}", id, e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Error updating leave balance: " + e.getMessage()));
        }
    }

    @PostMapping("/balance") // Changed from "/" to "/balance" to avoid conflict with other potential POSTs to /api/leave
    public ResponseEntity<?> createOrUpdateLeaveBalance(@RequestBody LeaveBalanceDTO dto) {
        try {
            // Assuming leaveBalanceService has this method
            HrLeaveBalance balance = leaveBalanceService.createOrUpdateBalance(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success", "data", balance));
        } catch (Exception e) {
            logger.error("Error creating/updating leave balance for employee {}: {}", dto.getEmployeeId(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "status", "error",
                            "message", "Error processing leave balance: " + e.getMessage()
                    )
            );
        }
    }

    // --- Endpoints from the second controller ---

    @GetMapping("/balance") // This is /api/leave/balance?params...
    public HrLeaveBalance getSpecificLeaveBalance(
            @RequestParam String employeeId,
            @RequestParam Long leaveYearId,
            @RequestParam Long leaveTypeId) {
        logger.info("Fetching specific leave balance for employeeId: {}, leaveYearId: {}, leaveTypeId: {}",
                employeeId, leaveYearId, leaveTypeId);
        // This method exists in the provided LeaveBalanceService
        HrLeaveBalance balance = leaveBalanceService.getLeaveBalance(employeeId, leaveYearId, leaveTypeId);
        if (balance == null) {
            logger.warn("No specific leave balance found for employeeId: {}, leaveYearId: {}, leaveTypeId: {}",
                    employeeId, leaveYearId, leaveTypeId);
            // Consider returning ResponseEntity with 404 or a specific structure if null
        } else {
            logger.info("Found specific leave balance: Total Days = {}, Remaining Days = {}",
                    balance.getTotalDays(), balance.getRemainingDays());
        }
        return balance; // If null, Spring Boot will return a 200 OK with an empty body by default,
        // or 204 No Content if the method return type is ResponseEntity<Void> and it returns null.
        // For direct object return, a null might lead to an empty body or an error depending on configuration.
        // It's often better to wrap in ResponseEntity to control the response explicitly.
    }

    @GetMapping("/leave-types")
    public Iterable<HrLuLeaveType> getAllLeaveTypes() {
        logger.info("Fetching all leave types");
        return leaveBalanceService.getAllLeaveTypes();
    }

    @GetMapping("/leave-years")
    public Iterable<HrLuLeaveYear> getAllLeaveYears() {
        logger.info("Fetching all leave years");
        return leaveBalanceService.getAllLeaveYears();
    }
}