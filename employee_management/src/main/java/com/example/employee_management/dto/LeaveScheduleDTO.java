package com.example.employee_management.dto;

public class LeaveScheduleDTO {
    private Long id;
    private Long leaveYearId;
    private String employeeId;
    private String status;
    private String description;
    // You could add employeeName here if you join and fetch it in the service
    // private String employeeName;
    // You could add a resolved year string (e.g., "2024") if leaveYearId is a foreign key
    // private String leaveYear;


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLeaveYearId() {
        return leaveYearId;
    }

    public void setLeaveYearId(Long leaveYearId) {
        this.leaveYearId = leaveYearId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}