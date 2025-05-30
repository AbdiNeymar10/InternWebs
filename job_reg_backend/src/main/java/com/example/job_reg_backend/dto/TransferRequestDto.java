package com.example.job_reg_backend.dto;

public class TransferRequestDto {
    private String employeeName;
    private String gender;
    private String hiredDate;
    private String empId;
    private String icf;
    private String description;
    private String dateRequest;
    private String transferType;
    private Long jobPositionId;
    private Long transferFromId;
    private Long transferToId;
    private Long payGradeId;
    private Long jobResponsibilityId;
    private Long branchId;
    private Long jobCodeId; 
    // private String jobCode; 

    // Getters and Setters
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getHiredDate() { return hiredDate; }
    public void setHiredDate(String hiredDate) { this.hiredDate = hiredDate; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getIcf() { return icf; }
    public void setIcf(String icf) { this.icf = icf; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDateRequest() { return dateRequest; }
    public void setDateRequest(String dateRequest) { this.dateRequest = dateRequest; }

    public String getTransferType() { return transferType; }
    public void setTransferType(String transferType) { this.transferType = transferType; }

    public Long getJobPositionId() { return jobPositionId; }
    public void setJobPositionId(Long jobPositionId) { this.jobPositionId = jobPositionId; }

    public Long getTransferFromId() { return transferFromId; }
    public void setTransferFromId(Long transferFromId) { this.transferFromId = transferFromId; }

    public Long getTransferToId() { return transferToId; }
    public void setTransferToId(Long transferToId) { this.transferToId = transferToId; }

    public Long getPayGradeId() { return payGradeId; }
    public void setPayGradeId(Long payGradeId) { this.payGradeId = payGradeId; }

    public Long getJobResponsibilityId() { return jobResponsibilityId; }
    public void setJobResponsibilityId(Long jobResponsibilityId) { this.jobResponsibilityId = jobResponsibilityId; }

    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }

    public Long getJobCodeId() { return jobCodeId; } 
    public void setJobCodeId(Long jobCodeId) { this.jobCodeId = jobCodeId; } 

    // public String getJobCode() { return jobCode; }
    // public void setJobCode(String jobCode) { this.jobCode = jobCode; }
}
