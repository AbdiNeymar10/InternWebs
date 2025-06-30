package com.example.employee_management.dto;

public class DepartmentApprovalDTO {
    private String status;
    private String remark;
    private Double approvedDays;
    private String leaveStart;
    private String leaveEnd;
    private Float requestedDays;

    // Getters and Setters for all fields
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Double getApprovedDays() {
        return approvedDays;
    }

    public void setApprovedDays(Double approvedDays) {
        this.approvedDays = approvedDays;
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
}
    