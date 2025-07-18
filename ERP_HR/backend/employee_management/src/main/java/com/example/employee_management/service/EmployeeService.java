package com.example.employee_management.service;

import com.example.employee_management.dto.EmployeeDetailsDTO2;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.HrDepartment;
import com.example.employee_management.entity.HrJobType;
import com.example.employee_management.entity.HrJobTypeDetail;
import com.example.employee_management.entity.HrLuJobType;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.*;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;
    private final HrJobTypeDetailRepository hrJobTypeDetailRepository;
    private final HrJobTypeRepository hrJobTypeRepository;
    // private final HrLuJobTypeRepository hrLuJobTypeRepository;
    private final HrDepartmentRepository hrDepartmentRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository,
            HrJobTypeDetailRepository hrJobTypeDetailRepository,
            HrJobTypeRepository hrJobTypeRepository,
            HrLuJobTypeRepository hrLuJobTypeRepository,
            HrDepartmentRepository hrDepartmentRepository,
            ModelMapper modelMapper) {
        this.employeeRepository = employeeRepository;
        this.hrJobTypeDetailRepository = hrJobTypeDetailRepository;
        this.hrJobTypeRepository = hrJobTypeRepository;
        // this.hrLuJobTypeRepository = hrLuJobTypeRepository;
        this.hrDepartmentRepository = hrDepartmentRepository;
        this.modelMapper = modelMapper;
    }

    private String mapEmploymentType(Integer employmentTypeCode) {
        if (employmentTypeCode == null)
            return "N/A";
        switch (employmentTypeCode) {
            case 1:
                return "Permanent";
            case 2:
                return "Contract";
            default:
                return "Other (" + employmentTypeCode + ")";
        }
    }

    public EmployeeDetailsDTO2 getEmployeeDetailsByEmpId(String empId) {
        logger.info("Fetching full employee details for empId: {}", empId);

        Employee employee = employeeRepository.findByEmpId(empId)
                .orElseThrow(() -> {
                    logger.warn("Employee not found with empId: {}", empId);
                    return new ResourceNotFoundException("Employee not found with empId: " + empId);
                });

        EmployeeDetailsDTO2 dto = modelMapper.map(employee, EmployeeDetailsDTO2.class);

        String rawHireDateFromDb = employee.getHireDate();
        logger.info("Raw HIRE_DATE string from DB for empId {}: '{}'", empId, rawHireDateFromDb);
        dto.setHiredDate(rawHireDateFromDb);

        String resolvedJobTitleName = "N/A";
        Long employeeJobCode = employee.getJobCode(); // This is HR_EMPLOYEES.JOB_CODE

        if (employeeJobCode != null) {
            logger.debug("Resolving job title for HR_EMPLOYEES.JOB_CODE: {}", employeeJobCode);
            try {
                // Step 1: Use HR_EMPLOYEES.JOB_CODE to find a record in HR_JOB_TYPE_DETAIL by
                // its Primary Key (ID)
                // This links HR_EMPLOYEES.JOB_CODE to HR_JOB_TYPE_DETAIL.ID
                Optional<HrJobTypeDetail> hrJobTypeDetailOpt = hrJobTypeDetailRepository.findById(employeeJobCode);

                if (hrJobTypeDetailOpt.isPresent()) {
                    HrJobTypeDetail hrJobTypeDetail = hrJobTypeDetailOpt.get();
                    logger.debug("Found HR_JOB_TYPE_DETAIL with PK ID: {} (using employee's JOB_CODE as the ID)",
                            hrJobTypeDetail.getId());

                    // Step 2: From the found HR_JOB_TYPE_DETAIL record, get its JOB_TYPE_ID column
                    // value.
                    Long jobTypeIdFromDetail = hrJobTypeDetail.getJobTypeId();
                    logger.debug("HR_JOB_TYPE_DETAIL's JOB_TYPE_ID is: {}", jobTypeIdFromDetail);

                    if (jobTypeIdFromDetail != null) {
                        // Step 3: Use this JOB_TYPE_ID from HR_JOB_TYPE_DETAIL to find the record in
                        // HR_JOB_TYPE by its Primary Key (ID)
                        // This links HR_JOB_TYPE_DETAIL.JOB_TYPE_ID to HR_JOB_TYPE.ID
                        Optional<HrJobType> hrJobTypeOpt = hrJobTypeRepository.findById(jobTypeIdFromDetail);

                        if (hrJobTypeOpt.isPresent()) {
                            HrJobType hrJobType = hrJobTypeOpt.get();
                            logger.debug("Found HR_JOB_TYPE with ID: {} (using JOB_TYPE_ID from detail)",
                                    hrJobType.getId());

                            // Step 4: From HR_JOB_TYPE, get the JOB_TITLE (which is an HrLuJobType object
                            // due to @ManyToOne mapping)
                            // This HrLuJobType object is linked via HR_JOB_TYPE.JOB_TITLE (numeric FK) ->
                            // HR_LU_JOB_TYPE.ID
                            HrLuJobType luJobTypeObject = hrJobType.getJobTitle(); // This is the HrLuJobType entity

                            if (luJobTypeObject != null) {
                                // Step 5: Get the actual job title text from the HrLuJobType object
                                resolvedJobTitleName = luJobTypeObject.getJobTitle(); // Assumes HrLuJobType has a
                                                                                      // getJobTitle() returning String
                                logger.debug("Successfully resolved job title from HR_LU_JOB_TYPE (ID: {}): {}",
                                        luJobTypeObject.getId(), resolvedJobTitleName);
                            } else {
                                resolvedJobTitleName = "N/A - JobTitle (HrLuJobType link) in HrJobType is null for HrJobType.ID: "
                                        + hrJobType.getId();
                                logger.warn(resolvedJobTitleName);
                            }
                        } else {
                            resolvedJobTitleName = "N/A - HrJobType Not Found for ID: " + jobTypeIdFromDetail
                                    + " (which came from HR_JOB_TYPE_DETAIL.JOB_TYPE_ID)";
                            logger.warn(resolvedJobTitleName);
                        }
                    } else {
                        resolvedJobTitleName = "N/A - JOB_TYPE_ID in HrJobTypeDetail is null for detail PK ID: "
                                + hrJobTypeDetail.getId();
                        logger.warn(resolvedJobTitleName);
                    }
                } else {
                    resolvedJobTitleName = "N/A - HrJobTypeDetail Not Found for ID: " + employeeJobCode
                            + " (using employee's JOB_CODE as the ID for HR_JOB_TYPE_DETAIL)";
                    logger.warn(resolvedJobTitleName);
                }
            } catch (Exception e) {
                logger.error("Exception during job title resolution for JOB_CODE {}: {}", employeeJobCode,
                        e.getMessage(), e);
                resolvedJobTitleName = "N/A - Error Resolving Title";
            }
        } else {
            resolvedJobTitleName = "N/A - Employee's JOB_CODE is null";
            logger.warn(resolvedJobTitleName);
        }
        dto.setJobTitleName(resolvedJobTitleName);

        // Populate Department Name and Directorate Name
        dto.setDepartmentName("N/A");
        dto.setDirectorateName("N/A");
        if (employee.getDepartmentId() != null) {
            long immediateDeptId = employee.getDepartmentId().longValue();
            Optional<HrDepartment> immediateDepartmentOpt = hrDepartmentRepository.findById(immediateDeptId);

            if (immediateDepartmentOpt.isPresent()) {
                HrDepartment immediateDepartment = immediateDepartmentOpt.get();
                dto.setDepartmentName(immediateDepartment.getDepName() != null ? immediateDepartment.getDepName()
                        : "N/A - Dept Name Missing");

                if (immediateDepartment.getDeptLevel() != null) {
                    Long directorateDeptId = immediateDepartment.getDeptLevel();
                    Optional<HrDepartment> directorateDepartmentOpt = hrDepartmentRepository
                            .findById(directorateDeptId);
                    if (directorateDepartmentOpt.isPresent()) {
                        dto.setDirectorateName(directorateDepartmentOpt.get().getDepName() != null
                                ? directorateDepartmentOpt.get().getDepName()
                                : "N/A - Directorate Name Missing");
                    } else {
                        dto.setDirectorateName("N/A - Directorate Dept Not Found for ID: " + directorateDeptId);
                    }
                } else {
                    dto.setDirectorateName("N/A - Immediate Dept Lacks DEPT_LEVEL Link");
                }
            } else {
                dto.setDepartmentName("N/A - Department Not Found for ID: " + immediateDeptId);
            }
        } else {
            dto.setDepartmentName("N/A - Employee Lacks DEPT_ID");
        }

        dto.setEmploymentType(mapEmploymentType(employee.getEmploymentType()));

        logger.info("Successfully prepared EmployeeDetailsDTO2 for empId: {}", empId);
        return dto;
    }
}