package com.example.employee_management.dto;

import java.util.List;

public class SubmitLeaveTransferRequestDTO {
    private String requesterId;
    private Integer budgetYear;
    private List<LeaveTransferDetailDTO> details;

    // Getters and Setters
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

    public List<LeaveTransferDetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<LeaveTransferDetailDTO> details) {
        this.details = details;
    }
}