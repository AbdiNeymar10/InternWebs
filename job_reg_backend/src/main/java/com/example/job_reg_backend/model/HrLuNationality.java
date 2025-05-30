package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_NATIONALITY")
public class HrLuNationality {

    @Id
    @Column(name = "NATIONALITYID")
    private Long nationalityId;

    @Column(name = "NATIONALITYDESCRIP", length = 255)
    private String nationalityDescription;

    @Column(name = "NATIONALITYNAME", length = 255)
    private String nationalityName;

    // Constructors
    public HrLuNationality() {
    }

    public HrLuNationality(Long nationalityId, String nationalityDescription, String nationalityName) {
        this.nationalityId = nationalityId;
        this.nationalityDescription = nationalityDescription;
        this.nationalityName = nationalityName;
    }

    // Getters and Setters
    public Long getNationalityId() {
        return nationalityId;
    }

    public void setNationalityId(Long nationalityId) {
        this.nationalityId = nationalityId;
    }

    public String getNationalityDescription() {
        return nationalityDescription;
    }

    public void setNationalityDescription(String nationalityDescription) {
        this.nationalityDescription = nationalityDescription;
    }

    public String getNationalityName() {
        return nationalityName;
    }

    public void setNationalityName(String nationalityName) {
        this.nationalityName = nationalityName;
    }
}