package com.example.employee_management.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "HR_LU_JOB_GRADE")
public class HrLuJobGrade {

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
    public HrLuJobGrade() {}

    public HrLuJobGrade(Long id, String grade, String description) {
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