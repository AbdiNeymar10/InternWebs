package com.example.employee_management.dto;
public class JobTypeDTO {
    private Long id;
    private String jobTitle;
    private String status;
    private String code;
    private String jobTitleInAmharic;
    private String description;

    // Getters and Setters
    public Long getId() {  // Changed return type to Long
        return id;
    }

    public void setId(Long id) {  // Changed parameter type to Long
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
}