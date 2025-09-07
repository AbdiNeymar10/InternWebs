package com.example.employee_management.service;

import com.example.employee_management.entity.EmployeeSeparation;
import com.example.employee_management.repository.EmployeeSeparationRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;

@Service
public class EmployeeSeparationService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeSeparationService.class);

    @Autowired
    private EmployeeSeparationRepository employeeSeparationRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public EmployeeSeparation createSeparationRequest(EmployeeSeparation request) {
        BigDecimal sequenceValue = (BigDecimal) entityManager
                .createNativeQuery("SELECT HR_EMPLOYEE_SEPARATION_SEQ.NEXTVAL FROM DUAL")
                .getSingleResult();
        request.setId(sequenceValue.toString());

        if (request.getStatus() == null) {
            request.setStatus(0); // Default status to pending
        }
        logger.info("Creating new separation request with ID: {}, for employeeId: {}",
                request.getId(), request.getEmployeeId());
        return employeeSeparationRepository.save(request);
    }

    public List<EmployeeSeparation> getEmployeeSeparations(String employeeId) {
        return employeeSeparationRepository.findByEmployeeId(employeeId);
    }

    public List<EmployeeSeparation> getPendingSeparations() {
        return employeeSeparationRepository.findByStatus(0, Sort.by(Sort.Direction.DESC, "requestDate"));
    }

    public List<EmployeeSeparation> getSeparationsByStatusAndSort(Integer status, Sort sort) {
        return employeeSeparationRepository.findByStatus(status, sort);
    }

    @Transactional
    public EmployeeSeparation updateSeparation(EmployeeSeparation separationUpdateData) {
        if (separationUpdateData.getId() == null || separationUpdateData.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("ID cannot be null for an update operation.");
        }

        EmployeeSeparation existingSeparation = employeeSeparationRepository.findById(separationUpdateData.getId())
                .orElseThrow(() -> new RuntimeException("EmployeeSeparation record not found with ID: " + separationUpdateData.getId()));

        // Scenario 1: Employee is resubmitting a rejected request.
        // The frontend will set the status to 0 to signify this.
        if (separationUpdateData.getStatus() != null && separationUpdateData.getStatus() == 0) {
            logger.info("Resubmitting rejected request ID: {}. Resetting status to 0 (Pending).", existingSeparation.getId());
            existingSeparation.setStatus(0);
            existingSeparation.setSeparationTypeId(separationUpdateData.getSeparationTypeId());
            existingSeparation.setRequestDate(separationUpdateData.getRequestDate()); // Update request date
            existingSeparation.setResignationDate(separationUpdateData.getResignationDate());
            existingSeparation.setDescription(separationUpdateData.getDescription());
            existingSeparation.setComment(separationUpdateData.getComment()); // Employee's new reason/comment
            existingSeparation.setPreparedBy(separationUpdateData.getPreparedBy());
            existingSeparation.setRemark(separationUpdateData.getRemark()); // Overwrite old rejection remark with new reason

            if (StringUtils.hasText(separationUpdateData.getSupportiveFileName())) {
                existingSeparation.setSupportiveFileName(separationUpdateData.getSupportiveFileName());
            }
        } else {
            // Scenario 2: An approver (Dept/HR) is updating the status.
            if (separationUpdateData.getStatus() != null) {
                existingSeparation.setStatus(separationUpdateData.getStatus());
                logger.info("Updating status to: {} for request ID: {}", separationUpdateData.getStatus(), existingSeparation.getId());
            }
            if (StringUtils.hasText(separationUpdateData.getRemark())) {
                // This remark is from the approver (Dept/HR)
                existingSeparation.setRemark(separationUpdateData.getRemark());
                logger.info("Updating approver remark for request ID: {}", existingSeparation.getId());
            }
        }

        logger.info("Saving updated separation request for ID: {}", existingSeparation.getId());
        return employeeSeparationRepository.save(existingSeparation);
    }

    public EmployeeSeparation getSeparationById(String id) {
        return employeeSeparationRepository.findById(id).orElse(null);
    }

    /**
     * Fetches all separation requests for a given employee that have been rejected.
     * Rejected statuses are 3 (Dept. Rejected) and 4 (HR Rejected).
     * @param employeeId The ID of the employee.
     * @return A list of rejected EmployeeSeparation entities.
     */
    public List<EmployeeSeparation> getRejectedSeparationsForEmployee(String employeeId) {
        logger.info("Fetching rejected separation requests for employee ID: {}", employeeId);
        return employeeSeparationRepository.findByEmployeeIdAndStatusIn(employeeId, List.of(3, 4));
    }
}