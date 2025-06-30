package com.example.employee_management.dto;

public class LeaveRequestDTO {
    private String employeeId;
    private Long leaveTypeId;
    private String leaveStart;
    private String leaveEnd;
    private Float requestedDays;
    private String dayType;
    private String description;
    // Reverted to String incidentType to match the entity and frontend payload
    private String incidentType;

    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getLeaveStart() {
        return leaveStart;
    }

    public void setLeaveStart(String leaveStart) {
        this.leaveStart = leaveStart;
    }

    public String getLeaveEnd() {
        return leaveEnd;
    }

    public void setLeaveEnd(String leaveEnd) {
        this.leaveEnd = leaveEnd;
    }

    public Float getRequestedDays() {
        return requestedDays;
    }

    public void setRequestedDays(Float requestedDays) {
        this.requestedDays = requestedDays;
    }

    public String getDayType() {
        return dayType;
    }

    public void setDayType(String dayType) {
        this.dayType = dayType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for String incidentType
    public String getIncidentType() {
        return incidentType;
    }

    // Setter for String incidentType
    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }
}