package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_EDUCATION_LEVEL")
public class Education_Level {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_education_level_seq")
    @SequenceGenerator(name = "hr_lu_education_level_seq", sequenceName = "HR_LU_EDUCATION_LEVEL_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "CATAGORY")
    private String catagory;

    @Column(name = "EDU_NAME")
    private String eduName;

    @Column(name = "RANK")
    private String rank;

    @Column(name = "EDU_LEVEL")
    private Integer eduLevel;

    @Column(name = "CATEGORY")
    private String category;

    // Constructors
    public Education_Level() {}

    public Education_Level(Long id, String catagory, String eduName, String rank, Integer eduLevel, String category) {
        this.id = id;
        this.catagory = catagory;
        this.eduName = eduName;
        this.rank = rank;
        this.eduLevel = eduLevel;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCatagory() {
        return catagory;
    }

    public void setCatagory(String catagory) {
        this.catagory = catagory;
    }

    public String getEduName() {
        return eduName;
    }

    public void setEduName(String eduName) {
        this.eduName = eduName;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public Integer getEduLevel() {
        return eduLevel;
    }

    public void setEduLevel(Integer eduLevel) {
        this.eduLevel = eduLevel;
    }
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}