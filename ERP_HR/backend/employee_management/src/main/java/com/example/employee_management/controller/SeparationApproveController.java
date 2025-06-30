package com.example.employee_management.controller;

import com.example.employee_management.entity.SeparationApprove;
import com.example.employee_management.service.SeparationApproveService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/separation-approvals")
public class SeparationApproveController {

    private static final Logger logger = LoggerFactory.getLogger(SeparationApproveController.class);

    @Autowired
    private SeparationApproveService separationApproveService;

    @PostMapping
    public SeparationApprove createApproval(@RequestBody SeparationApprove approval) {
        logger.info("Received POST request to /api/separation-approvals");
        logger.info("Request body (SeparationApprove object): {}", approval != null ? approval.toString() : "null");
        if (approval != null) {
            logger.info("Separation Request ID from payload: {}", approval.getSeparationRequestId());
            logger.info("Employee ID from payload: {}", approval.getEmployeeId());
            logger.info("Waiting Days from payload: {}", approval.getWaitingDays());
            logger.info("Additional Waiting Days from payload: {}", approval.getAdditionalWaitingDays());
            logger.info("Remark from payload: {}", approval.getRemark());
        }
        try {
            return separationApproveService.createApproval(approval);
        } catch (Exception e) {
            logger.error("Error occurred in createApproval controller method: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/request/{requestId}")
    public List<SeparationApprove> getApprovalsByRequestId(@PathVariable String requestId) {
        logger.info("Received GET request to /api/separation-approvals/request/{}", requestId);
        return separationApproveService.getApprovalsByRequestId(requestId);
    }

    @GetMapping("/employee/{employeeId}")
    public List<SeparationApprove> getApprovalsByEmployeeId(@PathVariable String employeeId) {
        logger.info("Received GET request to /api/separation-approvals/employee/{}", employeeId);
        return separationApproveService.getApprovalsByEmployeeId(employeeId);
    }
}