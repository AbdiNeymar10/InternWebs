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
import java.util.Optional;

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
        // requestDate will be saved to REQUEST_DATE column.
        // supportiveFileName will be saved if set on the 'request' object.
        logger.info("Creating separation request for employeeId: {}, requestDate (acting as preparedDate): {}, supportiveFileName: {}",
                request.getEmployeeId(), request.getRequestDate(), request.getSupportiveFileName());
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

        Optional<EmployeeSeparation> existingSeparationOptional = employeeSeparationRepository.findById(separationUpdateData.getId());
        if (!existingSeparationOptional.isPresent()) {
            throw new RuntimeException("EmployeeSeparation record not found with ID: " + separationUpdateData.getId());
        }

        EmployeeSeparation existingSeparation = existingSeparationOptional.get();

        if (separationUpdateData.getStatus() != null) {
            existingSeparation.setStatus(separationUpdateData.getStatus());
            logger.info("Updating status to: {} for request ID: {}", separationUpdateData.getStatus(), existingSeparation.getId());
        }
        if (StringUtils.hasText(separationUpdateData.getRemark())) {
            existingSeparation.setRemark(separationUpdateData.getRemark());
            logger.info("Updating remark for request ID: {}", existingSeparation.getId());
        }
        // Other fields like supportiveFileName, preparedBy, and requestDate (which includes preparedDate)
        // are preserved from the original record unless explicitly part of the update payload.
        // The current frontend logic for approval updates only status and remark on the main separation.

        logger.info("Saving updated separation request for ID: {}, Employee ID: {}", existingSeparation.getId(), existingSeparation.getEmployeeId());
        return employeeSeparationRepository.save(existingSeparation);
    }

    public EmployeeSeparation getSeparationById(String id) {
        return employeeSeparationRepository.findById(id).orElse(null);
    }
}