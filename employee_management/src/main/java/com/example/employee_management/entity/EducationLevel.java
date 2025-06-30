package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "HR_LU_EDUCATION_LEVEL")
@Data
public class EducationLevel {

    @Id
    @Column(name = "ID", nullable = false)
    private Long id;

    @Column(name = "CATAGORY", length = 255)
    private String category;

    @Column(name = "EDU_NAME", length = 255)
    private String eduName;

    @Column(name = "RANK", length = 100)
    private String rank;

    @Column(name = "EDU_LEVEL")
    private Integer eduLevel;

    @Column(name = "CATEGORY", length = 255)
    private String categoryChar;
}