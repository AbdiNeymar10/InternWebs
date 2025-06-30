package com.example.employee_management.service;

import com.example.employee_management.entity.EmployeeSeparation;
import com.example.employee_management.entity.SeparationApprove;
import com.example.employee_management.repository.SeparationApproveRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SeparationApproveService {

    private static final Logger logger = LoggerFactory.getLogger(SeparationApproveService.class);

    @Autowired
    private SeparationApproveRepository separationApproveRepository;

    @Autowired
    private EmployeeSeparationService employeeSeparationService;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public SeparationApprove createApproval(SeparationApprove approval) {
        if (approval == null) {
            logger.error("Approval object received in createApproval service is null.");
            throw new IllegalArgumentException("Approval object cannot be null.");
        }
        logger.info("Inside createApproval service for separationRequestId: {}", approval.getSeparationRequestId());

        if (approval.getSeparationRequestId() == null || approval.getSeparationRequestId().trim().isEmpty()) {
            logger.error("SeparationRequestId is null or empty in the approval object.");
            throw new IllegalArgumentException("SeparationRequestId cannot be null or empty for an approval.");
        }
        if (approval.getEmployeeId() == null || approval.getEmployeeId().trim().isEmpty()) {
            logger.error("EmployeeId is null or empty in the approval object.");
            throw new IllegalArgumentException("EmployeeId cannot be null or empty for an approval.");
        }

        BigDecimal sequenceValue;
        try {
            sequenceValue = (BigDecimal) entityManager
                    .createNativeQuery("SELECT HR_EMP_SEPARATION_APPROVE_SEQ.NEXTVAL FROM DUAL")
                    .getSingleResult();
        } catch (Exception e) {
            logger.error("CRITICAL: Failed to get NEXTVAL from HR_EMP_SEPARATION_APPROVE_SEQ. Ensure sequence exists and is accessible. Error: {}", e.getMessage(), e);
            throw new RuntimeException("Could not generate approval ID from sequence. Database sequence 'HR_EMP_SEPARATION_APPROVE_SEQ' might be missing or inaccessible.", e);
        }

        String newApprovalId = sequenceValue.toString();
        approval.setId(newApprovalId);
        logger.info("Generated new SeparationApprove ID: {}", newApprovalId);

        EmployeeSeparation separation = employeeSeparationService.getSeparationById(approval.getSeparationRequestId());
        if (separation == null) {
            logger.error("Original separation request not found with ID: {}. Cannot create approval record.", approval.getSeparationRequestId());
            throw new RuntimeException("Original separation request not found with ID: " + approval.getSeparationRequestId() + ". Approval record creation failed.");
        }
        logger.info("Found original separation request: {}. Current status: {}", separation.getId(), separation.getStatus());

        logger.info("Attempting to save SeparationApprove record: {}", approval.toString());
        try {
            SeparationApprove savedApproval = separationApproveRepository.save(approval);
            logger.info("Successfully saved SeparationApprove record with ID: {}", savedApproval.getId());
            return savedApproval;
        } catch (Exception e) {
            logger.error("Database error while saving SeparationApprove record for request ID {}: {}", approval.getSeparationRequestId(), e.getMessage(), e);
            throw new RuntimeException("Could not save approval record due to a database error. Check server logs for details.", e);
        }
    }

    public List<SeparationApprove> getApprovalsByRequestId(String requestId) {
        return separationApproveRepository.findBySeparationRequestId(requestId);
    }

    public List<SeparationApprove> getApprovalsByEmployeeId(String employeeId) {
        return separationApproveRepository.findByEmployeeId(employeeId);
    }
}