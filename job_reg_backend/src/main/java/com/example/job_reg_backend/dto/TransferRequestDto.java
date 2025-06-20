package com.example.job_reg_backend.dto;

public class TransferRequestDto {
    private Long id;
    private Long transferRequesterId; 
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
    private String status;
    private String remark;
    private String approvedBy;
    private Long branchFromId; 
    private String preparedDate;
    private String checkedDate;
    private String authorizedDate;
    private String stepNo;
    private String approveDate;
    private Integer icfId;


    // Getter and Setter for id
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // Getter and Setter for transferRequesterId
    public Long getTransferRequesterId() { return transferRequesterId; }
    public void setTransferRequesterId(Long transferRequesterId) { this.transferRequesterId = transferRequesterId; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public Long getBranchFromId() { return branchFromId; } 
    public void setBranchFromId(Long branchFromId) { this.branchFromId = branchFromId; } 

    public String getPreparedDate() {return preparedDate; }
    public void setPreparedDate(String preparedDate) {this.preparedDate = preparedDate; }

    public String getCheckedDate() {return checkedDate; }
    public void setCheckedDate(String checkedDate) {this.checkedDate = checkedDate; }

    public String getAuthorizedDate() {return authorizedDate;}
    public void setAuthorizedDate(String authorizedDate) {this.authorizedDate = authorizedDate; }

    public String getStepNo() { return stepNo; }
    public void setStepNo(String stepNo) { this.stepNo = stepNo; }

    public String getApproveDate() { return approveDate; }
    public void setApproveDate(String approveDate) { this.approveDate = approveDate; }

    public Integer getIcfId() { return icfId; }
    public void setIcfId(Integer icfId) { this.icfId = icfId; }

}
