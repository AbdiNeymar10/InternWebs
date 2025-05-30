package com.example.job_reg_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "HR_LU_RECRUITMENT_TYPE")
public class HrLuRecruitmentType {


    @Column(name = "RECRUITMENT_ID", precision = 7)
    private Integer recruitmentId;
    @Id
    @Size(max = 45, message = "Recruitment type must be at most 45 characters")
    @Column(name = "RECRUITMENT_TYPE", length = 45)
    private String recruitmentType;

    @Size(max = 200, message = "Description must be at most 200 characters")
    @Column(name = "DESCRIPTION", length = 200)
    private String description;

    // Constructors
    public HrLuRecruitmentType() {
    }

    public HrLuRecruitmentType(Integer recruitmentId, String recruitmentType, String description) {
        this.recruitmentId = recruitmentId;
        this.recruitmentType = recruitmentType;
        this.description = description;
    }

    // Getters and Setters
    public Integer getRecruitmentId() {
        return recruitmentId;
    }

    public void setRecruitmentId(Integer recruitmentId) {
        this.recruitmentId = recruitmentId;
    }

    public String getRecruitmentType() {
        return recruitmentType;
    }

    public void setRecruitmentType(String recruitmentType) {
        this.recruitmentType = recruitmentType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "HrLuRecruitmentType{" +
                "recruitmentId=" + recruitmentId +
                ", recruitmentType='" + recruitmentType + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}