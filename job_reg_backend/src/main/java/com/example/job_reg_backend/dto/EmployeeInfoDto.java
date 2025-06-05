package com.example.job_reg_backend.dto;

public class EmployeeInfoDto {
    private String employeeId;
    private String employeeName;
    private String gender;
    private String hiredDate;
    private String icf;
    private String departmentName;
    private String jobPosition;
    private String jobPositionId;
    private String jobCode;
    private String branch;
    private String branchId;
    private String jobResponsibility;
    private String jobResponsibilityId;
    private String payGradeId;
    private String directorateName;
    private String fromDepartmentId;
    private String approvedBy;
    private String currentSalary;
    private String toDepartmentId;

    public EmployeeInfoDto() {}

    public EmployeeInfoDto(String employeeId, String employeeName, String gender, String hiredDate, String icf, String departmentName, String jobPosition, String jobPositionId, String jobCode, String branch, String branchId, String jobResponsibility, String jobResponsibilityId, String payGradeId, String directorateName, String fromDepartmentId, String approvedBy, String currentSalary, String toDepartmentId) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.gender = gender;
        this.hiredDate = hiredDate;
        this.icf = icf;
        this.departmentName = departmentName;
        this.jobPosition = jobPosition;
        this.jobPositionId = jobPositionId;
        this.jobCode = jobCode;
        this.branch = branch;
        this.branchId = branchId;
        this.jobResponsibility = jobResponsibility;
        this.jobResponsibilityId = jobResponsibilityId;
        this.payGradeId = payGradeId;
        this.directorateName = directorateName;
        this.fromDepartmentId = fromDepartmentId;
        this.approvedBy = approvedBy;
        this.currentSalary = currentSalary;
        this.toDepartmentId = toDepartmentId;
    }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getHiredDate() { return hiredDate; }
    public void setHiredDate(String hiredDate) { this.hiredDate = hiredDate; }

    public String getIcf() { return icf; }
    public void setIcf(String icf) { this.icf = icf; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getJobPosition() { return jobPosition; }
    public void setJobPosition(String jobPosition) { this.jobPosition = jobPosition; }

    public String getJobPositionId() { return jobPositionId; }
    public void setJobPositionId(String jobPositionId) { this.jobPositionId = jobPositionId; }

    public String getJobCode() { return jobCode; }
    public void setJobCode(String jobCode) { this.jobCode = jobCode; }
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    public String getBranchId() { return branchId; }
    public void setBranchId(String branchId) { this.branchId = branchId; }
    public String getJobResponsibility() { return jobResponsibility; }
    public void setJobResponsibility(String jobResponsibility) { this.jobResponsibility = jobResponsibility; }
    public String getJobResponsibilityId() { return jobResponsibilityId; }
    public void setJobResponsibilityId(String jobResponsibilityId) { this.jobResponsibilityId = jobResponsibilityId; }
    public String getPayGradeId() { return payGradeId; }
    public void setPayGradeId(String payGradeId) { this.payGradeId = payGradeId; }

    public String getDirectorateName() { return directorateName; }
    public void setDirectorateName(String directorateName) { this.directorateName = directorateName; }

    public String getFromDepartmentId() { return fromDepartmentId; }
    public void setFromDepartmentId(String fromDepartmentId) { this.fromDepartmentId = fromDepartmentId; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public String getCurrentSalary() { return currentSalary; }
    public void setCurrentSalary(String currentSalary) { this.currentSalary = currentSalary; }

    public String getToDepartmentId() { return toDepartmentId; }
    public void setToDepartmentId(String toDepartmentId) { this.toDepartmentId = toDepartmentId; }
}
