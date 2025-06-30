package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_JOB_TYPE_DETAIL")
public class HRJob_TypeDetail {

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
    private HR_LuIcf icf; 

    @ManyToOne
    @JoinColumn(name = "JOB_TYPE_ID", referencedColumnName = "ID")
    private HRJob_Type jobType; 

    // Constructors
    public HRJob_TypeDetail() {}

    public HRJob_TypeDetail(Long id, String positionCode, String remark, Integer status, HR_LuIcf icf, HRJob_Type jobType) {
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

    public HR_LuIcf getIcf() {
        return icf;
    }

    public void setIcf(HR_LuIcf icf) {
        this.icf = icf;
    }

    public HRJob_Type getJobType() {
        return jobType;
    }

    public void setJobType(HRJob_Type jobType) {
        this.jobType = jobType;
    }
}