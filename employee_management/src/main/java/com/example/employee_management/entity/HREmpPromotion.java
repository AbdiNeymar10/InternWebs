package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "HR_EMP_PROMOTION")
public class HREmpPromotion {

    @Id
    @Column(name = "PROMOTION_ID", nullable = false)
    private Long promotionId;

    @Column(name = "DEPARTMENT_TO")
    private Long departmentTo;

    @Column(name = "EMP_ID_FROM")
    private String empIdFrom;

    @Column(name = "JOB_CODE_FROM")
    private Long jobCodeFrom;

    @Column(name = "JOB_CODE_TO")
    private Long jobCodeTo;

    @Column(name = "PROMOTER_ID")
    private String promoterId;

    @Column(name = "PROMOTION_DATE")
    private String promotionDate;

    @Column(name = "PROMOTION_REQUEST_ID")
    private Long promotionRequestId;

    @Column(name = "RANK_FROM")
    private Long rankFrom;

    @Column(name = "RANK_TO")
    private Long rankTo;

    @Column(name = "REFERENCE_DATE")
    private String referenceDate;

    @Column(name = "REFERENCE_NO")
    private String referenceNo;

    @Column(name = "SALARY_FROM")
    private BigDecimal salaryFrom;

    @Column(name = "SALARY_TO")
    private BigDecimal salaryTo;

    @Column(name = "STEP_FROM")
    private Long stepFrom;

    @Column(name = "STEP_TO")
    private Long stepTo;

    // Getters and Setters
    public Long getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(Long promotionId) {
        this.promotionId = promotionId;
    }

    public Long getDepartmentTo() {
        return departmentTo;
    }

    public void setDepartmentTo(Long departmentTo) {
        this.departmentTo = departmentTo;
    }

    public String getEmpIdFrom() {
        return empIdFrom;
    }

    public void setEmpIdFrom(String empIdFrom) {
        this.empIdFrom = empIdFrom;
    }

    public Long getJobCodeFrom() {
        return jobCodeFrom;
    }

    public void setJobCodeFrom(Long jobCodeFrom) {
        this.jobCodeFrom = jobCodeFrom;
    }

    public Long getJobCodeTo() {
        return jobCodeTo;
    }

    public void setJobCodeTo(Long jobCodeTo) {
        this.jobCodeTo = jobCodeTo;
    }

    public String getPromoterId() {
        return promoterId;
    }

    public void setPromoterId(String promoterId) {
        this.promoterId = promoterId;
    }

    public String getPromotionDate() {
        return promotionDate;
    }

    public void setPromotionDate(String promotionDate) {
        this.promotionDate = promotionDate;
    }

    public Long getPromotionRequestId() {
        return promotionRequestId;
    }

    public void setPromotionRequestId(Long promotionRequestId) {
        this.promotionRequestId = promotionRequestId;
    }

    public Long getRankFrom() {
        return rankFrom;
    }

    public void setRankFrom(Long rankFrom) {
        this.rankFrom = rankFrom;
    }

    public Long getRankTo() {
        return rankTo;
    }

    public void setRankTo(Long rankTo) {
        this.rankTo = rankTo;
    }

    public String getReferenceDate() {
        return referenceDate;
    }

    public void setReferenceDate(String referenceDate) {
        this.referenceDate = referenceDate;
    }

    public String getReferenceNo() {
        return referenceNo;
    }

    public void setReferenceNo(String referenceNo) {
        this.referenceNo = referenceNo;
    }

    public BigDecimal getSalaryFrom() {
        return salaryFrom;
    }

    public void setSalaryFrom(BigDecimal salaryFrom) {
        this.salaryFrom = salaryFrom;
    }

    public BigDecimal getSalaryTo() {
        return salaryTo;
    }

    public void setSalaryTo(BigDecimal salaryTo) {
        this.salaryTo = salaryTo;
    }

    public Long getStepFrom() {
        return stepFrom;
    }

    public void setStepFrom(Long stepFrom) {
        this.stepFrom = stepFrom;
    }

    public Long getStepTo() {
        return stepTo;
    }

    public void setStepTo(Long stepTo) {
        this.stepTo = stepTo;
    }
}