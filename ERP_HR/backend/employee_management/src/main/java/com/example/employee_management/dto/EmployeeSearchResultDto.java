package com.example.employee_management.dto;

import java.util.Objects;

public class EmployeeSearchResultDto {
    private String empId;
    private String firstName;
    private String lastName;
    private String fullName; // Combined name for display
    private String departmentName;
    private String positionName;

    public EmployeeSearchResultDto(String empId, String firstName, String lastName, String fullName, String departmentName, String positionName) {
        this.empId = empId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.departmentName = departmentName;
        this.positionName = positionName;
    }

    // Getters and Setters
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getPositionName() { return positionName; }
    public void setPositionName(String positionName) { this.positionName = positionName; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmployeeSearchResultDto that = (EmployeeSearchResultDto) o;
        return Objects.equals(empId, that.empId) && Objects.equals(fullName, that.fullName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(empId, fullName);
    }
}
    