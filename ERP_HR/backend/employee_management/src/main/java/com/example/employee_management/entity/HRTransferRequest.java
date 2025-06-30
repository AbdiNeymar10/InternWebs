package com.example.employee_management.entity;

import com.example.employee_management.util.SalaryEncryptor;
import jakarta.persistence.*;

@Entity
@Table(name = "HR_TRANSFER_REQUEST")
public class HRTransferRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_transfer_request_seq")
    @SequenceGenerator(name = "hr_transfer_request_seq", sequenceName = "HR_TRANSFER_REQUEST_SEQ", allocationSize = 1)
    @Column(name = "TRANSFER_REQUESTER_ID")
    private Long transferRequesterId;

    @Column(name = "TRANSFER_TYPE")
    private String transferType;

    @ManyToOne
    @JoinColumn(name = "TRANSFER_FROM", referencedColumnName = "DEPT_ID")
    private Department transferFrom;

    @Column(name = "DATE_REQUEST")
    private String dateRequest;

    @Column(name = "CHECKED_DATE")
    private String checkedDate;

    @Column(name = "PREPARED_DATE")
    private String preparedDate;

    @Column(name = "AUTHORIZED_DATE")
    private String authorizedDate;

    @ManyToOne
    @JoinColumn(name = "TRANSFER_TO", referencedColumnName = "DEPT_ID")
    private Department transferTo;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private String status = "0";

    @ManyToOne
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID", nullable = false)
    private HrEmployee employee;

    @Column(name = "APPROVED_BY")
    private String approvedBy;

    @Column(name = "APPROVE_DATE")
    private String approveDate;

    @Column(name = "COMMENT_GIVEN")
    private String commentGiven;

    @ManyToOne
    @JoinColumn(name = "JOB_CODE", referencedColumnName = "ID")
    private HRJob_Type jobCode;

    @ManyToOne
    @JoinColumn(name = "REQUIRED_EMPS", referencedColumnName = "ID")
    private HrLuBranch requiredEmps;

    @Column(name = "APPROVER2")
    private String approver2;

    @Column(name = "REMARK")
    private String remark;

    @Column(name = "SELECTIONSTATUS")
    private Integer selectionStatus = 0;

    @Column(name = "SELECTIONSTATUS2")
    private Integer selectionStatus2 = 0;

    @ManyToOne
    @JoinColumn(name = "JOB_POSITION", referencedColumnName = "ID")
    private HRJob_TypeDetail jobPosition;

    @ManyToOne
    @JoinColumn(name = "NEW_JOB_PAYGRADE", referencedColumnName = "PAY_GRADE_ID")
    private HRPay_Grad newJobPayGrade;

    @Column(name = "STATUS2")
    private String status2;

    @ManyToOne
    @JoinColumn(name = "RESPONSIBILITY", referencedColumnName = "ID")
    private HrLuResponsibility responsibility;

    @ManyToOne
    @JoinColumn(name = "BIRANCH_ID", referencedColumnName = "ID")
    private HrLuBranch biranchId;

    @Column(name = "BRANCH_FROM")
    private String branchFrom;

    @Column(name = "ICF")
    private Integer icf;

    @Convert(converter = SalaryEncryptor.class)
    @Column(name = "SALARY", length = 500)
    private String salary;

    @Column(name = "EMPLOYMENT_TYPE")
    private Integer employmentType;

    // Constructors
    public HRTransferRequest() {
    }

    public HRTransferRequest(
            Long transferRequesterId,
            String transferType,
            Department transferFrom,
            String dateRequest,
            String checkedDate,
            String authorizedDate,
            String preparedDate,
            Department transferTo,
            String description,
            String status,
            HrEmployee employee,
            String approvedBy,
            String approveDate,
            String commentGiven,
            HRJob_Type jobCode,
            HrLuBranch requiredEmps,
            String approver2,
            String remark,
            Integer selectionStatus,
            Integer selectionStatus2,
            HRJob_TypeDetail jobPosition,
            HRPay_Grad newJobPayGrade,
            String status2,
            HrLuResponsibility responsibility,
            HrLuBranch biranchId,
            Integer icf,
            String salary,
            String branchFrom,
            Integer employmentType) {
        this.transferRequesterId = transferRequesterId;
        this.transferType = transferType;
        this.transferFrom = transferFrom;
        this.dateRequest = dateRequest;
        this.checkedDate = checkedDate;
        this.authorizedDate = authorizedDate;
        this.preparedDate = preparedDate;
        this.transferTo = transferTo;
        this.description = description;
        this.status = status;
        this.employee = employee;
        this.approvedBy = approvedBy;
        this.approveDate = approveDate;
        this.commentGiven = commentGiven;
        this.jobCode = jobCode;
        this.requiredEmps = requiredEmps;
        this.approver2 = approver2;
        this.remark = remark;
        this.selectionStatus = selectionStatus;
        this.selectionStatus2 = selectionStatus2;
        this.jobPosition = jobPosition;
        this.newJobPayGrade = newJobPayGrade;
        this.status2 = status2;
        this.responsibility = responsibility;
        this.biranchId = biranchId;
        this.branchFrom = branchFrom;
        this.icf = icf;
        this.salary = salary;
        this.employmentType = employmentType;
    }

    // Getters and Setters

    public Long getTransferRequesterId() {
        return transferRequesterId;
    }

    public void setTransferRequesterId(Long transferRequesterId) {
        this.transferRequesterId = transferRequesterId;
    }

    public String getTransferType() {
        return transferType;
    }

    public void setTransferType(String transferType) {
        this.transferType = transferType;
    }

    public Department getTransferFrom() {
        return transferFrom;
    }

    public void setTransferFrom(Department transferFrom) {
        this.transferFrom = transferFrom;
    }

    public String getDateRequest() {
        return dateRequest;
    }

    public void setDateRequest(String dateRequest) {
        this.dateRequest = dateRequest;
    }

    public String getCheckedDate() {
        return checkedDate;
    }

    public void setCheckedDate(String checkedDate) {
        this.checkedDate = checkedDate;
    }

    public String getAuthorizedDate() {
        return authorizedDate;
    }

    public void setAuthorizedDate(String authorizedDate) {
        this.authorizedDate = authorizedDate;
    }

    public String getPreparedDate() {
        return preparedDate;
    }

    public void setPreparedDate(String preparedDate) {
        this.preparedDate = preparedDate;
    }

    public Department getTransferTo() {
        return transferTo;
    }

    public void setTransferTo(Department transferTo) {
        this.transferTo = transferTo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public HrEmployee getEmployee() {
        return employee;
    }

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getApproveDate() {
        return approveDate;
    }

    public void setApproveDate(String approveDate) {
        this.approveDate = approveDate;
    }

    public String getCommentGiven() {
        return commentGiven;
    }

    public void setCommentGiven(String commentGiven) {
        this.commentGiven = commentGiven;
    }

    public HRJob_Type getJobCode() {
        return jobCode;
    }

    public void setJobCode(HRJob_Type jobCode) {
        this.jobCode = jobCode;
    }

    public HrLuBranch getRequiredEmps() {
        return requiredEmps;
    }

    public void setRequiredEmps(HrLuBranch requiredEmps) {
        this.requiredEmps = requiredEmps;
    }

    public String getApprover2() {
        return approver2;
    }

    public void setApprover2(String approver2) {
        this.approver2 = approver2;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getSelectionStatus() {
        return selectionStatus;
    }

    public void setSelectionStatus(Integer selectionStatus) {
        this.selectionStatus = selectionStatus;
    }

    public Integer getSelectionStatus2() {
        return selectionStatus2;
    }

    public void setSelectionStatus2(Integer selectionStatus2) {
        this.selectionStatus2 = selectionStatus2;
    }

    public HRJob_TypeDetail getJobPosition() {
        return jobPosition;
    }

    public void setJobPosition(HRJob_TypeDetail jobPosition) {
        this.jobPosition = jobPosition;
    }

    public HRPay_Grad getNewJobPayGrade() {
        return newJobPayGrade;
    }

    public void setNewJobPayGrade(HRPay_Grad newJobPayGrade) {
        this.newJobPayGrade = newJobPayGrade;
    }

    public String getStatus2() {
        return status2;
    }

    public void setStatus2(String status2) {
        this.status2 = status2;
    }

    public HrLuResponsibility getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(HrLuResponsibility responsibility) {
        this.responsibility = responsibility;
    }

    public HrLuBranch getBiranchId() {
        return biranchId;
    }

    public void setBiranchId(HrLuBranch biranchId) {
        this.biranchId = biranchId;
    }

    public Integer getIcf() {
        return icf;
    }

    public void setIcf(Integer icf) {
        this.icf = icf;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getBranchFrom() {
        return branchFrom;
    }

    public void setBranchFrom(String branchFrom) {
        this.branchFrom = branchFrom;
    }

    public Integer getEmploymentType() {
        return employmentType;
    }
    public void setEmploymentType(Integer employmentType) {
        this.employmentType = employmentType;
    }
}