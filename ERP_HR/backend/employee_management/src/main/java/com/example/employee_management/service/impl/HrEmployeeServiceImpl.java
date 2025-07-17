package com.example.employee_management.service.impl;

import com.example.employee_management.entity.Department;
// import com.example.employee_management.entity.HrDepartment;
import com.example.employee_management.entity.HrEmployee;
// import com.example.employee_management.entity.HRPay_Grad;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.DepartmentRepository;
// import com.example.employee_management.repository.HrDepartmentRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
// import com.example.employee_management.repository.HRPay_GradRepository;
import com.example.employee_management.service.HrEmployeeService;
import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.repository.HrPayGradeRepository;
import com.example.employee_management.dto.EmployeeInfoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.stream.Stream;

@Service
@Transactional
public class HrEmployeeServiceImpl implements HrEmployeeService {

    private final HrEmployeeRepository employeeRepository;
    private final HrEmployeeRepository empRepository;
    private final DepartmentRepository departmentRepository;
    private final HrPayGradeRepository payGradeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public HrEmployeeServiceImpl(HrEmployeeRepository employeeRepository, DepartmentRepository departmentRepository,
            HrPayGradeRepository payGradeRepository, HrEmployeeRepository empRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.payGradeRepository = payGradeRepository;
        this.empRepository = employeeRepository;
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
        if (employee.getDepartment() != null && employee.getDepartment().getDeptId() != null) {
            Department department = departmentRepository.findById(employee.getDepartment().getDeptId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + employee.getDepartment().getDeptId()));
            employee.setDepartment(department);
        }

        if (employee.getPayGrade() != null && employee.getPayGrade().getPayGradeId() != null) {
            HrPayGrad payGrade = payGradeRepository.findById(employee.getPayGrade().getPayGradeId())
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
                        HrPayGrad payGrade = payGradeRepository.findById(
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

    @Override
    public byte[] getEmployeePhoto(String empId) {
        byte[] photo = employeeRepository.getEmployeePhoto(empId);
        if (photo == null) {
            throw new ResourceNotFoundException("No photo found for employee with id: " + empId);
        }
        return photo;
    }

    @Override
    @Transactional
    public void updateEmployeePhoto(String empId, byte[] photo) {
        if (!employeeRepository.existsById(empId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }
        try {
            employeeRepository.updateEmployeePhoto(empId, photo);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update employee photo: " + e.getMessage(), e);
        }
    }

    @Override
    public EmployeeDelegationDto getEmployeeDelegationDetails(String empId) {
        HrEmployee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));

        StringBuilder fullName = new StringBuilder();
        if (employee.getFirstName() != null) {
            fullName.append(employee.getFirstName());
        }
        if (employee.getMiddleName() != null) {
            fullName.append(" ").append(employee.getMiddleName());
        }
        if (employee.getLastName() != null) {
            fullName.append(" ").append(employee.getLastName());
        }

        String departmentName = (employee.getDepartment() != null && employee.getDepartment().getDepName() != null)
                ? employee.getDepartment().getDepName()
                : "N/A";

        return new EmployeeDelegationDto(
                fullName.toString().trim(),
                employee.getEmpId(),
                departmentName);
    }

    @Override
    public List<Map<String, String>> searchEmployees(String query) {
        List<HrEmployee> employees = employeeRepository.findByEmpIdOrNameContaining(query);
        return employees.stream().map(emp -> {
            Map<String, String> map = new HashMap<>();
            String fullName = Stream.of(emp.getFirstName(), emp.getMiddleName(), emp.getLastName())
                    .filter(Objects::nonNull)
                    .collect(Collectors.joining(" "));
            map.put("id", emp.getEmpId());
            map.put("name", fullName);
            map.put("department", emp.getDepartment() != null && emp.getDepartment().getDepName() != null
                    ? emp.getDepartment().getDepName()
                    : "N/A");
            return map;
        }).collect(Collectors.toList());
    }

    // employeeInfoDto method to get employee details
    @Override
    public EmployeeInfoDto getEmployeeInfo(String empId) {
        HrEmployee employee = empRepository.findEmployeeWithJobTypeAndPayGrade(empId);
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
        if (jobPosition == null && employee.getJobTypeDetail() != null
                && employee.getJobTypeDetail().getJobType() != null
                && employee.getJobTypeDetail().getJobType().getJobTitle() != null) {
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
            jobCode = employee.getJobTypeDetail().getJobType().getId() != null
                    ? employee.getJobTypeDetail().getJobType().getId().toString()
                    : null;
        }
        String payGradeId = null;
        if (employee.getPayGrade() != null) {
            payGradeId = employee.getPayGrade().getPayGradeId() != null
                    ? employee.getPayGrade().getPayGradeId().toString()
                    : null;
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

        String jobResponsibility = employee.getJobResponsibility() != null
                ? employee.getJobResponsibility().getResponsibility()
                : null;
        String jobResponsibilityId = employee.getJobResponsibility() != null
                && employee.getJobResponsibility().getId() != null ? employee.getJobResponsibility().getId().toString()
                        : null;
        String branch = employee.getBranch() != null ? employee.getBranch().getBranchName() : null;
        String branchId = employee.getBranch() != null && employee.getBranch().getId() != null
                ? employee.getBranch().getId().toString()
                : null;

        String jobPositionId = null;
        if (employee.getJobTypeDetail() != null && employee.getJobTypeDetail().getId() != null) {
            jobPositionId = employee.getJobTypeDetail().getId().toString();
        }

        String fromDepartmentId = employee.getDepartment() != null && employee.getDepartment().getDeptId() != null
                ? employee.getDepartment().getDeptId().toString()
                : null;

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
        String employmentType = null;
        if (employee.getEmploymentType() != null && employee.getEmploymentType().getType() != null) {
            employmentType = employee.getEmploymentType().getType();
        }

        String currentSalary = employee.getSalary();

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
                toDepartmentId,
                employmentType);
    }
}