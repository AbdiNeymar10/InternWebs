package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_NATION")
public class HrLuNation {

    @Id
    @Column(name = "NATION_CODE", nullable = false, precision = 10)
    private Integer nationCode;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @Column(name = "NAME", length = 255)
    private String name;

    @Column(name = "NATIONALITYID", precision = 10)
    private Integer nationalityId;

    // Constructors
    public HrLuNation() {
    }

    public HrLuNation(Integer nationCode, String description, String name, Integer nationalityId) {
        this.nationCode = nationCode;
        this.description = description;
        this.name = name;
        this.nationalityId = nationalityId;
    }

    // Getters and Setters
    public Integer getNationCode() {
        return nationCode;
    }

    public void setNationCode(Integer nationCode) {
        this.nationCode = nationCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getNationalityId() {
        return nationalityId;
    }

    public void setNationalityId(Integer nationalityId) {
        this.nationalityId = nationalityId;
    }
}