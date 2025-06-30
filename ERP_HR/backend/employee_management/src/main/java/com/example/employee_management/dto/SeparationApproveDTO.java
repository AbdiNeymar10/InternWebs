package com.example.employee_management.dto;


public class SeparationApproveDTO {
    private String separationRequestId;
    private String waitingDays;
    private String additionalWaitingDays;
    private String employeeId;
    private String remark;

    // Getters and Setters
    public String getSeparationRequestId() {
        return separationRequestId;
    }

    public void setSeparationRequestId(String separationRequestId) {
        this.separationRequestId = separationRequestId;
    }

    public String getWaitingDays() {
        return waitingDays;
    }

    public void setWaitingDays(String waitingDays) {
        this.waitingDays = waitingDays;
    }

    public String getAdditionalWaitingDays() {
        return additionalWaitingDays;
    }

    public void setAdditionalWaitingDays(String additionalWaitingDays) {
        this.additionalWaitingDays = additionalWaitingDays;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
