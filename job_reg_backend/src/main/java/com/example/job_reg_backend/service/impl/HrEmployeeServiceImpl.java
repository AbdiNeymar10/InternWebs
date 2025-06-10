package com.example.job_reg_backend.service.impl;

import com.example.job_reg_backend.model.Department;
//import com.example.job_reg_backend.model.HrDepartment;
import com.example.job_reg_backend.model.HrEmployee;
import com.example.job_reg_backend.model.HRPayGrad;
import com.example.job_reg_backend.exception.ResourceNotFoundException;
import com.example.job_reg_backend.repository.DepartmentRepository;
//import com.example.job_reg_backend.repository.HrDepartmentRepository;
import com.example.job_reg_backend.repository.HrEmployeeRepository;
import com.example.job_reg_backend.repository.HRPayGradRepository;
import com.example.job_reg_backend.service.HrEmployeeService;
import com.example.job_reg_backend.dto.EmployeeInfoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@Service
@Transactional
public class HrEmployeeServiceImpl implements HrEmployeeService {

    private final HrEmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final HRPayGradRepository payGradeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public HrEmployeeServiceImpl(HrEmployeeRepository employeeRepository, DepartmentRepository departmentRepository,
                                 HRPayGradRepository payGradeRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.payGradeRepository = payGradeRepository;
    }

    @Override
    public List<HrEmployee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public HrEmployee getEmployeeById(String empId) {
        return employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));
    }

    @Override
    public HrEmployee getEmployeeWithRelations(String empId) {
        return employeeRepository.findEmployeeWithAllRelations(empId);
    }

    @Override
    public HrEmployee getEmployeeWithPayGrade(String empId) {
        return employeeRepository.findEmployeeWithPayGrade(empId);
    }

    @Override
    public HrEmployee createEmployee(HrEmployee employee) {
        // Handle department relationship
        if (employee.getDepartment() != null && employee.getDepartment().getDeptId() != null) {
            Department department = departmentRepository.findById(employee.getDepartment().getDeptId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + employee.getDepartment().getDeptId()));
            employee.setDepartment(department);
        }

        // Handle pay grade relationship
        if (employee.getPayGrade() != null && employee.getPayGrade().getPayGradeId() != null) {
            HRPayGrad payGrade = payGradeRepository.findById(employee.getPayGrade().getPayGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Pay grade not found with id: " + employee.getPayGrade().getPayGradeId()));
            employee.setPayGrade(payGrade);
        }

        return employeeRepository.save(employee);
    }

    @Override
    public HrEmployee updateEmployee(String empId, HrEmployee employeeDetails) {
        return employeeRepository.findById(empId)
                .map(employee -> {
                    // Update basic fields
                    employee.setFirstName(employeeDetails.getFirstName());
                    employee.setLastName(employeeDetails.getLastName());
                    employee.setMiddleName(employeeDetails.getMiddleName());
                    // Update other fields as needed...

                    // Handle department update
                    if (employeeDetails.getDepartment() != null &&
                            employeeDetails.getDepartment().getDeptId() != null) {
                        Department department = departmentRepository.findById(
                                        employeeDetails.getDepartment().getDeptId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Department not found with id: " +
                                                employeeDetails.getDepartment().getDeptId()));
                        employee.setDepartment(department);
                    } else {
                        employee.setDepartment(null);
                    }

                    // Handle pay grade update
                    if (employeeDetails.getPayGrade() != null &&
                            employeeDetails.getPayGrade().getPayGradeId() != null) {
                        HRPayGrad payGrade = payGradeRepository.findById(
                                        employeeDetails.getPayGrade().getPayGradeId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Pay grade not found with id: " +
                                                employeeDetails.getPayGrade().getPayGradeId()));
                        employee.setPayGrade(payGrade);
                    } else {
                        employee.setPayGrade(null);
                    }

                    return employeeRepository.save(employee);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));
    }

    @Override
    public void deleteEmployee(String empId) {
        HrEmployee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));
        employeeRepository.delete(employee);
    }

    @Override
    public List<HrEmployee> getEmployeesByDepartment(Long deptId) {
        // Verify department exists first
        if (!departmentRepository.existsById(deptId)) {
            throw new ResourceNotFoundException("Department not found with id: " + deptId);
        }
        return employeeRepository.findByDepartment_DeptId(deptId);
    }

//    @Override
//    public List<HrEmployee> getEmployeesByPayGrade(Long payGradeId) {
//        // Verify pay grade exists first
//        if (!payGradeRepository.existsById(payGradeId)) {
//            throw new ResourceNotFoundException("Pay grade not found with id: " + payGradeId);
//        }
//        return employeeRepository.findByPayGrade_PayGradeId(payGradeId);
//    }

    @Override
    public EmployeeInfoDto getEmployeeInfo(String empId) {
        HrEmployee employee = employeeRepository.findEmployeeWithJobTypeAndPayGrade(empId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }

        String employeeName = (employee.getFirstName() != null ? employee.getFirstName() : "") +
                (employee.getMiddleName() != null ? " " + employee.getMiddleName() : "") +
                (employee.getLastName() != null ? " " + employee.getLastName() : "");
        String gender = employee.getSex();
        String hiredDate = employee.getHiredDate();
        String icf = null;
        if (employee.getIcf() != null) {
            icf = employee.getIcf().getIcf();
        }
        String departmentName = employee.getDepartment() != null ? employee.getDepartment().getDepName() : null;
        String jobPosition = null;
        if (employee.getJobTypeDetail() != null &&
            employee.getJobTypeDetail().getJobType() != null &&
            employee.getJobTypeDetail().getJobType().getJobTitle() != null &&
            employee.getJobTypeDetail().getJobType().getJobTitle().getJobTitle() != null) {
            jobPosition = employee.getJobTypeDetail().getJobType().getJobTitle().getJobTitle();
        }
        if (jobPosition == null && employee.getJobTypeDetail() != null && employee.getJobTypeDetail().getJobType() != null && employee.getJobTypeDetail().getJobType().getJobTitle() != null) {
            try {
                Object result = entityManager.createNativeQuery(
                    "SELECT JOB_TITLE FROM HR_LU_JOB_TYPE WHERE ID = :jobTitleId")
                    .setParameter("jobTitleId", employee.getJobTypeDetail().getJobType().getJobTitle().getId())
                    .getSingleResult();
                if (result != null) {
                    jobPosition = result.toString();
                }
            } catch (Exception e) {
            }
        }

        String directorateName = null;
        if (employee.getDepartment() != null && employee.getDepartment().getDeptLevel() != null) {
            Long parentDeptId = Long.valueOf(employee.getDepartment().getDeptLevel());
            Department parentDept = departmentRepository.findById(parentDeptId).orElse(null);
            if (parentDept != null) {
                directorateName = parentDept.getDepName();
            }
        }

        String jobCode = null;
        if (employee.getJobTypeDetail() != null && employee.getJobTypeDetail().getJobType() != null) {
            jobCode = employee.getJobTypeDetail().getJobType().getId() != null ? employee.getJobTypeDetail().getJobType().getId().toString() : null;
        }
        String payGradeId = null;
        if (employee.getPayGrade() != null) {
            payGradeId = employee.getPayGrade().getPayGradeId() != null ? employee.getPayGrade().getPayGradeId().toString() : null;
        }

        if (jobCode == null || payGradeId == null) {
            try {
                @SuppressWarnings("unchecked")
                java.util.List<Object[]> results = entityManager.createNativeQuery(
                        "SELECT JOB_CODE, PAY_GRADE_ID FROM HR_EMPLOYEES WHERE EMP_ID = :empId")
                        .setParameter("empId", empId)
                        .getResultList();
                if (!results.isEmpty()) {
                    Object[] result = results.get(0);
                    if (jobCode == null && result.length > 0 && result[0] != null) {
                        jobCode = result[0].toString();
                    }
                    if (payGradeId == null && result.length > 1 && result[1] != null) {
                        payGradeId = result[1].toString();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        String jobResponsibility = employee.getJobResponsibility() != null ? employee.getJobResponsibility().getResponsibility() : null;
        String jobResponsibilityId = employee.getJobResponsibility() != null && employee.getJobResponsibility().getId() != null ? employee.getJobResponsibility().getId().toString() : null;
        String branch = employee.getBranch() != null ? employee.getBranch().getBranchName() : null;
        String branchId = employee.getBranch() != null && employee.getBranch().getId() != null ? employee.getBranch().getId().toString() : null;

        String jobPositionId = null;
        if (employee.getJobTypeDetail() != null && employee.getJobTypeDetail().getId() != null) {
            jobPositionId = employee.getJobTypeDetail().getId().toString();
        }

        String fromDepartmentId = employee.getDepartment() != null && employee.getDepartment().getDeptId() != null ? employee.getDepartment().getDeptId().toString() : null;

        String toDepartmentId = "";
        try {
            Object result = entityManager.createNativeQuery(
                "SELECT d.DEPT_ID FROM HR_TRANSFER_REQUEST t JOIN HR_DEPARTMENT d ON t.TRANSFER_TO = d.DEPT_ID WHERE t.EMP_ID = :empId AND (t.STATUS = '1' OR t.STATUS = '2') ORDER BY t.APPROVE_DATE DESC FETCH FIRST 1 ROWS ONLY")
                .setParameter("empId", empId)
                .getSingleResult();
            if (result != null) {
                toDepartmentId = result.toString();
            }
        } catch (jakarta.persistence.NoResultException e) {
            toDepartmentId = "";
        } catch (Exception e) {
            toDepartmentId = "";
        }
        String approvedBy = null;
        try {
            Object result = entityManager.createNativeQuery(
                "SELECT APPROVED_BY FROM HR_TRANSFER_REQUEST WHERE EMP_ID = :empId AND STATUS = '2' ORDER BY APPROVE_DATE DESC FETCH FIRST 1 ROWS ONLY")
                .setParameter("empId", empId)
                .getSingleResult();
            if (result != null) {
                approvedBy = result.toString();
            }
        } catch (Exception e) {
           
        }

        String currentSalary = null;
        if (employee.getPayGrade() != null && employee.getPayGrade().getPayGradeId() != null) {
            try {
                Object result = entityManager.createNativeQuery(
                    "SELECT SALARY FROM HR_PAY_GRAD WHERE PAY_GRADE_ID = :id")
                    .setParameter("id", employee.getPayGrade().getPayGradeId())
                    .getSingleResult();
                if (result != null) {
                    currentSalary = result.toString(); 
                }
            } catch (Exception e) {
                currentSalary = null;
            }
        }

        return new EmployeeInfoDto(
                employee.getEmpId(),
                employeeName.trim(),
                gender,
                hiredDate,
                icf,
                departmentName,
                jobPosition,
                jobPositionId,
                jobCode,
                branch,
                branchId,
                jobResponsibility,
                jobResponsibilityId,
                payGradeId,
                directorateName,
                fromDepartmentId,
                approvedBy,
                currentSalary,
                toDepartmentId 
        );
    }
}