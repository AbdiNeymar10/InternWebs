package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "HR_RANK")
@Getter
@Setter
public class HrRank {

    @Id
    @Column(name = "RANK_ID", nullable = false, precision = 10)
    private Long rankId;

    @Column(name = "BEGINNING_SALARY", length = 255)
    private String beginningSalary;

    @Column(name = "MAX_SALARY", length = 255)
    private String maxSalary;

    @Column(name = "JOB_GRADE_ID", precision = 7)
    private Integer jobGradeId;

    @Column(name = "ICF_ID", precision = 7)
    private Integer icfId;
}