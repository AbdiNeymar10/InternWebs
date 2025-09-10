// Create this new file or add to existing DTO package
package com.example.employee_management.dto;

public class LeaveTransferDetailDTO {
    private Long detailId;
    private String empId;
    private String status;
    private String approverNotes;
    private String fullName;

    // Getters and Setters
    public Long getDetailId() {
        return detailId;
    }

    public void setDetailId(Long detailId) {
        this.detailId = detailId;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApproverNotes() {
        return approverNotes;
    }

    public void setApproverNotes(String approverNotes) {
        this.approverNotes = approverNotes;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}