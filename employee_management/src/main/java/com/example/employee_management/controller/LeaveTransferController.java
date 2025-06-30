package com.example.employee_management.controller;

import com.example.employee_management.dto.EmployeeDTO;
import com.example.employee_management.dto.LeaveTransferRequestDTO;
import com.example.employee_management.dto.SubmitLeaveTransferRequestDTO;
import com.example.employee_management.service.LeaveTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-transfer")
@CrossOrigin(origins = "http://localhost:3000") // Allow your frontend origin
public class LeaveTransferController {

    @Autowired
    private LeaveTransferService leaveTransferService;

    @GetMapping("/employee/{empId}")
    public ResponseEntity<EmployeeDTO> getEmployeeDetails(@PathVariable String empId) {
        EmployeeDTO employee = leaveTransferService.getEmployeeDetails(empId);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/employees/{empId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesInDepartment(@PathVariable String empId) {
        List<EmployeeDTO> employees = leaveTransferService.getEmployeesInDepartment(empId);
        return ResponseEntity.ok(employees);
    }

    @PostMapping("/request")
    public ResponseEntity<Void> submitLeaveTransferRequest(@RequestBody SubmitLeaveTransferRequestDTO requestDTO) {
        leaveTransferService.submitLeaveTransferRequest(requestDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests/{requesterId}")
    public ResponseEntity<List<LeaveTransferRequestDTO>> getSubmittedRequests(@PathVariable String requesterId) {
        List<LeaveTransferRequestDTO> requests = leaveTransferService.getSubmittedRequests(requesterId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<LeaveTransferRequestDTO>> getPendingRequests() {
        List<LeaveTransferRequestDTO> requests = leaveTransferService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/approve/{detailId}")
    public ResponseEntity<Void> approveLeaveTransferDetail(@PathVariable Long detailId) {
        leaveTransferService.approveLeaveTransferDetail(detailId);
        return ResponseEntity.ok().build();
    }
}