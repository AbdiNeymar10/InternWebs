package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_JOB_TYPE")
public class HRJobType {

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
    private JobType jobTitle; // Foreign key to HR_LU_JOB_TYPE

    @ManyToOne
    @JoinColumn(name = "JOB_GRADE", referencedColumnName = "ID")
    private HRLuJobGrade jobGrade; // Foreign key to HR_LU_JOB_GRADE

    @Column(name = "JOB_FAMILY")
    private Long jobFamily;

    // Constructors
    public HRJobType() {}

    public HRJobType(Long id, String jobCode, String jobStatus, String remark, JobType jobTitle, HRLuJobGrade jobGrade, Long jobFamily) {
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

    public JobType getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(JobType jobTitle) {
        this.jobTitle = jobTitle;
    }

    public HRLuJobGrade getJobGrade() {
        return jobGrade;
    }

    public void setJobGrade(HRLuJobGrade jobGrade) {
        this.jobGrade = jobGrade;
    }

    public Long getJobFamily() {
        return jobFamily;
    }

    public void setJobFamily(Long jobFamily) {
        this.jobFamily = jobFamily;
    }
}