package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_JOB_TYPE")
public class HRJob_Type {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_job_type_seq")
    @SequenceGenerator(name = "hr_job_type_seq", sequenceName = "HR_JOB_TYPE_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "JOB_CODE")
    private String jobCode;

    @Column(name = "JOB_STATUS")
    private String jobStatus;

    @Column(name = "REMARK")
    private String remark;

    @ManyToOne
    @JoinColumn(name = "JOB_TITLE", referencedColumnName = "ID")
    private Job_Type jobTitle; 

    @ManyToOne
    @JoinColumn(name = "JOB_GRADE", referencedColumnName = "ID")
    private HrLuJobGrade jobGrade; 

    @Column(name = "JOB_FAMILY")
    private Long jobFamily;

    // Constructors
    public HRJob_Type() {}

    public HRJob_Type(Long id, String jobCode, String jobStatus, String remark, Job_Type jobTitle, HrLuJobGrade jobGrade, Long jobFamily) {
        this.id = id;
        this.jobCode = jobCode;
        this.jobStatus = jobStatus;
        this.remark = remark;
        this.jobTitle = jobTitle;
        this.jobGrade = jobGrade;
        this.jobFamily = jobFamily;
    }

    // Getters and Setters
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

    public Job_Type getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(Job_Type jobTitle) {
        this.jobTitle = jobTitle;
    }

    public HrLuJobGrade getJobGrade() {
        return jobGrade;
    }

    public void setJobGrade(HrLuJobGrade jobGrade) {
        this.jobGrade = jobGrade;
    }

    public Long getJobFamily() {
        return jobFamily;
    }

    public void setJobFamily(Long jobFamily) {
        this.jobFamily = jobFamily;
    }
}