package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_JOBFAMILY")
public class JobFamily {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_family_seq")
    @SequenceGenerator(name = "job_family_seq", sequenceName = "JOB_FAMILY_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "FAMILYCODE", nullable = false, length = 20)
    private String familyCode;

    @Column(name = "STATUS", length = 20)
    private String status = "1";

    @Column(name = "FAMILY_NAME", nullable = false, length = 255)
    private String familyName;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFamilyCode() {
        return familyCode;
    }

    public void setFamilyCode(String familyCode) {
        this.familyCode = familyCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }
}