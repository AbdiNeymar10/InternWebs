package com.example.employee_management.dto;

import com.example.employee_management.entity.HrEmployee;
import lombok.Data;

@Data
public class EmployeeSummaryDto {
    private String empId;
    private String fullName;
    private String departmentName;
    private String positionName;

    public EmployeeSummaryDto(HrEmployee employee) {
        this.empId = employee.getEmpId();
        this.fullName = employee.getFirstName() + " " +
                (employee.getMiddleName() != null ? employee.getMiddleName() + " " : "") +
                employee.getLastName();
        this.departmentName = employee.getDepartment() != null ?
                employee.getDepartment().getDepName() : "";
//        this.positionName = employee.getPosition() != null ?
//                employee.getPosition().getPositionName() : "";
    }
}