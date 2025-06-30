package com.example.employee_management.entity;

import jakarta.persistence.*;
// import java.math.BigDecimal;

@Entity
@Table(name = "HR_JOB_TYPE")
public class HrJobType {

    @Id
    @Column(name = "ID", precision = 10, scale = 0)
    private Long id;

    @Column(name = "JOB_CODE", length = 255)
    private String jobCode;

    @ManyToOne
    @JoinColumn(name = "JOB_TITLE", referencedColumnName = "ID")
    private HrLuJobType jobTitle;

    @Column(name = "JOB_STATUS", length = 255)
    private String jobStatus;

    @Column(name = "REMARK", length = 255)
    private String remark;

    @ManyToOne
    @JoinColumn(name = "JOB_FAMILY", referencedColumnName = "ID")
    private HrLuJobFamily jobFamily;

    @ManyToOne
    @JoinColumn(name = "JOB_GRADE", referencedColumnName = "ID")
    private HrLuJobGrade jobGrade;

    public HrJobType() {
    }

    public HrJobType(Long id, String jobCode, HrLuJobType jobTitle, String jobStatus,
                     String remark, HrLuJobFamily jobFamily, HrLuJobGrade jobGrade) {
        this.id = id;
        this.jobCode = jobCode;
        this.jobTitle = jobTitle;
        this.jobStatus = jobStatus;
        this.remark = remark;
        this.jobFamily = jobFamily;
        this.jobGrade = jobGrade;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobCode() {
        return jobCode;
    }

    public void setJobCode(String jobCode) {
        this.jobCode = jobCode;
    }

    public HrLuJobType getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(HrLuJobType jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobStatus() {
        return jobStatus;
    }

    public void setJobStatus(String jobStatus) {
        this.jobStatus = jobStatus;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public HrLuJobFamily getJobFamily() {
        return jobFamily;
    }

    public void setJobFamily(HrLuJobFamily jobFamily) {
        this.jobFamily = jobFamily;
    }

    public HrLuJobGrade getJobGrade() {
        return jobGrade;
    }

    public void setJobGrade(HrLuJobGrade jobGrade) {
        this.jobGrade = jobGrade;
    }

    @Override
    public String toString() {
        return "HrJobType{" +
                "id=" + id +
                ", jobCode='" + jobCode + '\'' +
                ", jobTitle=" + (jobTitle != null ? jobTitle.getId() : null) +
                ", jobStatus='" + jobStatus + '\'' +
                ", remark='" + remark + '\'' +
                ", jobFamily=" + (jobFamily != null ? jobFamily.getId() : null) +
                ", jobGrade=" + (jobGrade != null ? jobGrade.getId() : null) +
                '}';
    }

    public Long getJobTitleLuId() {
        return 0L;
    }
}