package com.example.employee_management.dto;

public class HrApprovalDTO {
    private String status;
    private String remark;
    private Double approvedDays;

    // Getters and Setters
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
}
    