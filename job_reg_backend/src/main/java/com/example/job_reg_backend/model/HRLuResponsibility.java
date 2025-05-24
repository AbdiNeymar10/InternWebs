package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_RESPONSIBILITY")
public class HRLuResponsibility {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_responsibility_seq")
    @SequenceGenerator(name = "hr_lu_responsibility_seq", sequenceName = "HR_LU_RESPONSIBILITY_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "RESPONSIBILITY")
    private String responsibility;

    @Column(name = "DESCRIPTION")
    private String description;

    // Constructors
    public HRLuResponsibility() {}

    public HRLuResponsibility(Long id, String responsibility, String description) {
        this.id = id;
        this.responsibility = responsibility;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(String responsibility) {
        this.responsibility = responsibility;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}