package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "HR_LU_JOB_TYPE")
@Getter
@Setter
public class JobType { // This class represents HR_LU_JOB_TYPE

    @Id
    @Column(name = "ID", nullable = false) // NUMBER(7,0)
    private Long id;

    @Column(name = "JOB_TITLE") // VARCHAR2(255 BYTE) - The actual job title string
    private String jobTitle;

    @Column(name = "STATUS") // VARCHAR2(255 CHAR)
    private String status;

    @Column(name = "CODE") // VARCHAR2(255 CHAR)
    private String code;

    @Column(name = "JOB_TITLE_IN_AMHARIC") // VARCHAR2(255 BYTE)
    private String jobTitleInAmharic;

    @Column(name = "DESCRIPTION") // VARCHAR2(255 CHAR)
    private String description;
}