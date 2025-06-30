package com.example.employee_management.dto;

public class EmailNotificationRequestDTO {
    private String employeeId;
    private String employeeName;
    private String leaveTypeName;
    private String leaveStart;
    private String leaveEnd;
    private Number requestedDays; // Using Number to be flexible (Float from frontend)
    private String description;
    private String recipientEmail; // Optional: if frontend can specify recipient

    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getLeaveTypeName() {
        return leaveTypeName;
    }

    public void setLeaveTypeName(String leaveTypeName) {
        this.leaveTypeName = leaveTypeName;
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

    public Number getRequestedDays() {
        return requestedDays;
    }

    public void setRequestedDays(Number requestedDays) {
        this.requestedDays = requestedDays;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}