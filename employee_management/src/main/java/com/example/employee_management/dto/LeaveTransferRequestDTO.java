package com.example.employee_management.dto;

import java.util.List;

public class LeaveTransferRequestDTO {
    private Long transferId;
    private String requesterId;
    private Integer budgetYear;
    private String createdDate;
    private String status;
    private String deptName; // Added deptName
    private List<LeaveTransferDetailDTO> details;

    // Getters and Setters
    public Long getTransferId() {
        return transferId;
    }

    public void setTransferId(Long transferId) {
        this.transferId = transferId;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }

    public Integer getBudgetYear() {
        return budgetYear;
    }

    public void setBudgetYear(Integer budgetYear) {
        this.budgetYear = budgetYear;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public List<LeaveTransferDetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<LeaveTransferDetailDTO> details) {
        this.details = details;
    }
}