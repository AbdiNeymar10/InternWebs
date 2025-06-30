package com.example.employee_management.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "HR_LU_JOB_TYPE")
public class Job_Type {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_job_type_seq")
    @SequenceGenerator(name = "hr_lu_job_type_seq", sequenceName = "HR_LU_JOB_TYPE_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "CODE")
    private String code;

    @Column(name = "JOB_TITLE")
    private String jobTitle;

    @Column(name = "JOB_TITLE_IN_AMHARIC")
    private String jobTitleInAmharic;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "DESCRIPTION")
    private String description;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobTitleInAmharic() {
        return jobTitleInAmharic;
    }

    public void setJobTitleInAmharic(String jobTitleInAmharic) {
        this.jobTitleInAmharic = jobTitleInAmharic;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}