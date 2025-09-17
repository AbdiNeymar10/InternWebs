package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "HR_LU_JOB_TYPE")
public class HrLuJobType {

    @Id
    @Column(name = "ID", precision = 7)
    private Integer id;

    @Column(name = "JOB_TITLE", length = 255)
    private String jobTitle;

    @Column(name = "STATUS", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String status;

    @Column(name = "CODE", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String code;

    @Column(name = "JOB_TITLE_IN_AMHARIC", length = 255)
    private String jobTitleInAmharic;

    @Column(name = "DESCRIPTION", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String description;
    @JsonIgnore
    @OneToMany(mappedBy = "jobTitle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HrJobType> jobs;

    // Constructors
    public HrLuJobType() {
    }

    public HrLuJobType(Integer id, String jobTitle, String status, String code,
            String jobTitleInAmharic, String description) {
        this.id = id;
        this.jobTitle = jobTitle;
        this.status = status;
        this.code = code;
        this.jobTitleInAmharic = jobTitleInAmharic;
        this.description = description;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getJobTitleInAmharic() {
        return jobTitleInAmharic;
    }

    public void setJobTitleInAmharic(String jobTitleInAmharic) {
        this.jobTitleInAmharic = jobTitleInAmharic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<HrJobType> getJobs() {
        return jobs;
    }

    public void setJobs(List<HrJobType> jobs) {
        this.jobs = jobs;
    }

    // Helper methods for bidirectional relationship
    public void addJob(HrJobType job) {
        jobs.add(job);
        job.setJobTitle(this);
    }

    public void removeJob(HrJobType job) {
        jobs.remove(job);
        job.setJobTitle(null);
    }

    @Override
    public String toString() {
        return "HrLuJobType{" +
                "id=" + id +
                ", jobTitle='" + jobTitle + '\'' +
                ", status='" + status + '\'' +
                ", code='" + code + '\'' +
                ", jobTitleInAmharic='" + jobTitleInAmharic + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}