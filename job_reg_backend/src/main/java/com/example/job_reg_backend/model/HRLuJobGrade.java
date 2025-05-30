package com.example.job_reg_backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.annotation.JsonIdentityInfo;
//import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "HR_LU_JOB_GRADE")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class HRLuJobGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_job_grade_seq")
    @SequenceGenerator(name = "hr_lu_job_grade_seq", sequenceName = "HR_LU_JOB_GRADE_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "GRADE")
    private String grade;

    @Column(name = "DESCRIPTION")
    private String description;

    // Constructors
    public HRLuJobGrade() {}

    public HRLuJobGrade(Long id, String grade, String description) {
        this.id = id;
        this.grade = grade;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}