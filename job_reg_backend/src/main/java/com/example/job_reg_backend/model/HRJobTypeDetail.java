package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_JOB_TYPE_DETAIL")
public class HRJobTypeDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_job_type_detail_seq")
    @SequenceGenerator(name = "hr_job_type_detail_seq", sequenceName = "HR_JOB_TYPE_DETAIL_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "POSITION_CODE")
    private String positionCode;

    @Column(name = "REMARK")
    private String remark;

    @Column(name = "STATUS")
    private Integer status;

    @ManyToOne
    @JoinColumn(name = "ICF_ID", referencedColumnName = "ID")
    private HRLuIcf icf; // Foreign key to HR_LU_ICF

    @ManyToOne
    @JoinColumn(name = "JOB_TYPE_ID", referencedColumnName = "ID")
    private HRJobType jobType; // Foreign key to HR_JOB_TYPE

    // Constructors
    public HRJobTypeDetail() {}

    public HRJobTypeDetail(Long id, String positionCode, String remark, Integer status, HRLuIcf icf, HRJobType jobType) {
        this.id = id;
        this.positionCode = positionCode;
        this.remark = remark;
        this.status = status;
        this.icf = icf;
        this.jobType = jobType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPositionCode() {
        return positionCode;
    }

    public void setPositionCode(String positionCode) {
        this.positionCode = positionCode;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public HRLuIcf getIcf() {
        return icf;
    }

    public void setIcf(HRLuIcf icf) {
        this.icf = icf;
    }

    public HRJobType getJobType() {
        return jobType;
    }

    public void setJobType(HRJobType jobType) {
        this.jobType = jobType;
    }
}