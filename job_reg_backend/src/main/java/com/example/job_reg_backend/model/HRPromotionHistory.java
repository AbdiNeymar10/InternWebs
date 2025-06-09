package com.example.job_reg_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "HR_PROMOTION_HISTORY")
public class HRPromotionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "promotion_history_seq")
    @SequenceGenerator(name = "promotion_history_seq", sequenceName = "PROMOTION_HISTORY_SEQ", allocationSize = 1)
    @Column(name = "PROMOTION_HISTORY_ID")
    private Long promotionHistoryId;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @Column(name = "PREV_JOB_POSITION")
    private String prevJobPosition;

    @Column(name = "PREV_RANK")
    private String prevRank;

    @Column(name = "PREV_SALARY")
    private Double prevSalary;

    @Column(name = "PROM_LETTER_NUMBER")
    private String promLetterNumber;

    @Column(name = "PROMOTION_DATE")
    private String promotionDate;

    @Column(name = "PROMOTION_APPLY_ID")
    private Long promotionApplyId;

    @Column(name = "RECRUIT_REQUEST_ID")
    private Long recruitRequestId;

    @Column(name = "TIME_STAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;

    @Column(name = "USER_NAME")
    private String userName;

    @Column(name = "PREV_DEPARTMENT_ID")
    private Long prevDepartmentId;

    @Column(name = "DATE_PROMOTED")
    private String datePromoted;

    @Column(name = "JOBTITLE_CHANGED")
    private Integer jobTitleChanged = 0;

    @Column(name = "DEPT_TRANSFERTO")
    private Long deptTransferTo;

    @Column(name = "JOB_RESPONSIBILITY")
    private String jobResponsibility;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "BRANCHID")
    private Long branchId;

    @Column(name = "BRANCH_FROM")
    private Long branchFrom;

    // Getters and Setters

    public Long getPromotionHistoryId() {
        return promotionHistoryId;
    }

    public void setPromotionHistoryId(Long promotionHistoryId) {
        this.promotionHistoryId = promotionHistoryId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPrevJobPosition() {
        return prevJobPosition;
    }

    public void setPrevJobPosition(String prevJobPosition) {
        this.prevJobPosition = prevJobPosition;
    }

    public String getPrevRank() {
        return prevRank;
    }

    public void setPrevRank(String prevRank) {
        this.prevRank = prevRank;
    }

    public Double getPrevSalary() {
        return prevSalary;
    }

    public void setPrevSalary(Double prevSalary) {
        this.prevSalary = prevSalary;
    }

    public String getPromLetterNumber() {
        return promLetterNumber;
    }

    public void setPromLetterNumber(String promLetterNumber) {
        this.promLetterNumber = promLetterNumber;
    }

    public String getPromotionDate() {
        return promotionDate;
    }

    public void setPromotionDate(String promotionDate) {
        this.promotionDate = promotionDate;
    }

    public Long getPromotionApplyId() {
        return promotionApplyId;
    }

    public void setPromotionApplyId(Long promotionApplyId) {
        this.promotionApplyId = promotionApplyId;
    }

    public Long getRecruitRequestId() {
        return recruitRequestId;
    }

    public void setRecruitRequestId(Long recruitRequestId) {
        this.recruitRequestId = recruitRequestId;
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getPrevDepartmentId() {
        return prevDepartmentId;
    }

    public void setPrevDepartmentId(Long prevDepartmentId) {
        this.prevDepartmentId = prevDepartmentId;
    }

    public String getDatePromoted() {
        return datePromoted;
    }

    public void setDatePromoted(String datePromoted) {
        this.datePromoted = datePromoted;
    }

    public Integer getJobTitleChanged() {
        return jobTitleChanged;
    }

    public void setJobTitleChanged(Integer jobTitleChanged) {
        this.jobTitleChanged = jobTitleChanged;
    }

    public Long getDeptTransferTo() {
        return deptTransferTo;
    }

    public void setDeptTransferTo(Long deptTransferTo) {
        this.deptTransferTo = deptTransferTo;
    }

    public String getJobResponsibility() {
        return jobResponsibility;
    }

    public void setJobResponsibility(String jobResponsibility) {
        this.jobResponsibility = jobResponsibility;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public Long getBranchFrom() {
        return branchFrom;
    }

    public void setBranchFrom(Long branchFrom) {
        this.branchFrom = branchFrom;
    }
}