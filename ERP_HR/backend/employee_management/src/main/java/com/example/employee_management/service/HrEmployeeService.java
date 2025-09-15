package com.example.employee_management.service;

import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.dto.EmployeeInfoDto;
// import java.sql.Blob;
import java.util.List;
import java.util.Map;

public interface HrEmployeeService {
    List<HrEmployee> getAllEmployees();

    HrEmployee getEmployeeById(String empId);

    HrEmployee createEmployee(HrEmployee employee);

    HrEmployee updateEmployee(String empId, HrEmployee employeeDetails);

    void deleteEmployee(String empId);

    HrEmployee getEmployeeWithRelations(String empId);

    List<HrEmployee> getEmployeesByDepartment(Long deptId);

    HrEmployee getEmployeeWithPayGrade(String empId);

    byte[] getEmployeePhoto(String empId); // Changed from Blob to byte[]

    void updateEmployeePhoto(String empId, byte[] photo); // Changed from Blob to byte[]

    EmployeeDelegationDto getEmployeeDelegationDetails(String empId);

    EmployeeInfoDto getEmployeeInfo(String empId);

    List<Map<String, String>> searchEmployees(String query);

    class EmployeeDelegationDto {
        private String employeeName;
        private String employeeId;
        private String department;

        public EmployeeDelegationDto(String employeeName, String employeeId, String department) {
            this.employeeName = employeeName;
            this.employeeId = employeeId;
            this.department = department;
        }

        public String getEmployeeName() {
            return employeeName;
        }

        public void setEmployeeName(String employeeName) {
            this.employeeName = employeeName;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }
    }
}