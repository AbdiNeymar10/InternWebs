package com.example.job_reg_backend.service;

import com.example.job_reg_backend.dto.EmployeeInfoDto;
import com.example.job_reg_backend.model.HrEmployee;
import java.util.List;

public interface HrEmployeeService {
    List<HrEmployee> getAllEmployees();
    HrEmployee getEmployeeById(String empId);
    HrEmployee createEmployee(HrEmployee employee);
    HrEmployee updateEmployee(String empId, HrEmployee employeeDetails);
    void deleteEmployee(String empId);
    HrEmployee getEmployeeWithRelations(String empId);
    List<HrEmployee> getEmployeesByDepartment(Long deptId);
    HrEmployee getEmployeeWithPayGrade(String empId);
    EmployeeInfoDto getEmployeeInfo(String empId);


}