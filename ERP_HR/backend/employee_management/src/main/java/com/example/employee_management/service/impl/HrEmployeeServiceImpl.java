package com.example.employee_management.service.impl;

import com.example.employee_management.entity.Department;
// import com.example.employee_management.entity.HrDepartment;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.entity.HrLuPositionName;
// import com.example.employee_management.entity.HRPay_Grad;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.DepartmentRepository;
// import com.example.employee_management.repository.HrDepartmentRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import com.example.employee_management.repository.HrLuPositionNameRepository;
// import com.example.employee_management.repository.HRPay_GradRepository;
import com.example.employee_management.service.HrEmployeeService;
import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.repository.HrPayGradeRepository;
import com.example.employee_management.dto.EmployeeInfoDto;

import org.springframework.beans.BeanUtils;
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
    private final HrLuPositionNameRepository positionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    public HrEmployeeServiceImpl(HrEmployeeRepository employeeRepository, DepartmentRepository departmentRepository,
            HrPayGradeRepository payGradeRepository, HrEmployeeRepository empRepository,
            HrLuPositionNameRepository positionRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.payGradeRepository = payGradeRepository;
        this.empRepository = employeeRepository;
        this.positionRepository = positionRepository;
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
        // The repository's findEmployeeWithAllRelations method (ideally using
        // @EntityGraph)
        // is now responsible for fetching all required data, including the photo.
        HrEmployee employee = employeeRepository.findEmployeeWithAllRelations(empId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }
        return employee;
    }

    @Override
    public HrEmployee getEmployeeWithPayGrade(String empId) {
        return employeeRepository.findEmployeeWithPayGrade(empId);
    }

    @Override
    @Transactional
    public HrEmployee createEmployee(HrEmployee employee) {
        // To ensure data integrity, we re-fetch and set managed entities
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

        // Ensure salary is persisted:
        // - If the incoming employee object contains a salary, keep it.
        // - If not, but a pay grade was provided and has a salary, use that as the
        // employee salary.
        if ((employee.getSalary() == null || employee.getSalary().trim().isEmpty()) && employee.getPayGrade() != null
                && employee.getPayGrade().getSalary() != null) {
            employee.setSalary(employee.getPayGrade().getSalary());
        }

        if (employee.getPosition() != null && employee.getPosition().getId() != null) {
            HrLuPositionName position = positionRepository.findById(employee.getPosition().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Position not found with id: " + employee.getPosition().getId()));
            employee.setPosition(position);
        }

        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public HrEmployee updateEmployee(String empId, HrEmployee employeeDetails) {
        // 1. Fetch the existing, managed entity from the database.
        HrEmployee existingEmployee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));

        // 2. Handle photo update
        if (employeeDetails.getPhoto() != null && employeeDetails.getPhoto().length > 0) {
            existingEmployee.setPhoto(employeeDetails.getPhoto());
        }

        // 3. Handle relationship updates using private helper methods for clarity
        updateDepartment(employeeDetails, existingEmployee);
        updatePayGrade(employeeDetails, existingEmployee);
        updatePosition(employeeDetails, existingEmployee);

        // 4. Copy other simple properties, ignoring the ones we handled manually
        BeanUtils.copyProperties(employeeDetails, existingEmployee, "empId", "photo", "department", "payGrade",
                "position");

        // 5. Save the changes. Note: save() is not strictly necessary here on a managed
        // entity
        // within a @Transactional context, but it makes the intent clear and flushes
        // changes.
        employeeRepository.save(existingEmployee);

        // 6. Return the fully loaded entity to the client.
        // The repository method is responsible for eager loading all necessary fields.
        // The unreliable lazy-loading workaround has been removed.
        return employeeRepository.findEmployeeWithAllRelations(empId);
    }

    private void updateDepartment(HrEmployee employeeDetails, HrEmployee existingEmployee) {
        if (employeeDetails.getDepartment() != null && employeeDetails.getDepartment().getDeptId() != null) {
            Department department = departmentRepository.findById(employeeDetails.getDepartment().getDeptId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + employeeDetails.getDepartment().getDeptId()));
            existingEmployee.setDepartment(department);
        } else if (employeeDetails.getDepartment() == null) {
            existingEmployee.setDepartment(null);
        }
    }

    private void updatePayGrade(HrEmployee employeeDetails, HrEmployee existingEmployee) {
        if (employeeDetails.getPayGrade() != null && employeeDetails.getPayGrade().getPayGradeId() != null) {
            HrPayGrad payGrade = payGradeRepository.findById(employeeDetails.getPayGrade().getPayGradeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Pay grade not found with id: " + employeeDetails.getPayGrade().getPayGradeId()));
            existingEmployee.setPayGrade(payGrade);
        } else if (employeeDetails.getPayGrade() == null) {
            existingEmployee.setPayGrade(null);
        }
    }

    private void updatePosition(HrEmployee employeeDetails, HrEmployee existingEmployee) {
        if (employeeDetails.getPosition() != null && employeeDetails.getPosition().getId() != null) {
            HrLuPositionName position = positionRepository.findById(employeeDetails.getPosition().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Position not found with id: " + employeeDetails.getPosition().getId()));
            existingEmployee.setPosition(position);
        } else if (employeeDetails.getPosition() == null) {
            existingEmployee.setPosition(null);
        }
    }

    @Override
    @Transactional
    public void deleteEmployee(String empId) {
        // It's slightly more efficient to check for existence before fetching the whole
        // entity
        if (!employeeRepository.existsById(empId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }
        employeeRepository.deleteById(empId);
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
        // This is efficient as it doesn't load the entire employee object.
        byte[] photo = employeeRepository.getEmployeePhoto(empId);

        // Provide a more specific error message.
        if (photo == null) {
            // Check if the employee itself doesn't exist, or if they just don't have a
            // photo.
            if (!employeeRepository.existsById(empId)) {
                throw new ResourceNotFoundException("Employee not found with id: " + empId);
            }
            // If the employee exists but the photo is null, it's still a "not found" for
            // the photo resource.
            throw new ResourceNotFoundException("No photo found for employee with id: " + empId);
        }
        return photo;
    }

    @Override
    @Transactional
    public void updateEmployeePhoto(String empId, byte[] photo) {
        long startTime = System.currentTimeMillis();
        if (!employeeRepository.existsById(empId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }
        try {
            employeeRepository.updateEmployeePhoto(empId, photo);
        } catch (Exception e) {
            // Consider adding a proper logger (e.g., SLF4J) instead of RuntimeException
            // log.error("Failed to update photo for employee {}", empId, e);
            throw new RuntimeException("Failed to update employee photo for empId: " + empId, e);
        } finally {
            long endTime = System.currentTimeMillis();
            System.out.println("Photo update time: " + (endTime - startTime) + " ms for "
                    + (photo != null ? photo.length : 0) + " bytes");
        }
    }

    @Override
    public EmployeeDelegationDto getEmployeeDelegationDetails(String empId) {
        // This method relies on the repository fetching the necessary relations.
        HrEmployee employee = employeeRepository.findEmployeeWithAllRelations(empId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }

        String fullName = Stream.of(employee.getFirstName(), employee.getMiddleName(), employee.getLastName())
                .filter(Objects::nonNull)
                .collect(Collectors.joining(" "));

        String departmentName = (employee.getDepartment() != null && employee.getDepartment().getDepName() != null)
                ? employee.getDepartment().getDepName()
                : "N/A";

        return new EmployeeDelegationDto(
                fullName.trim(),
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