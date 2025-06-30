package com.example.employee_management.entity;

import jakarta.persistence.*;
import com.example.employee_management.util.SalaryEncryptor;

@Entity
@Table(name = "HR_RANK")
public class HR_Rank {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_rank_seq")
    @SequenceGenerator(name = "hr_rank_seq", sequenceName = "HR_RANK_SEQ", allocationSize = 1)
    @Column(name = "RANK_ID")
    private Long rankId;

    @Convert(converter = SalaryEncryptor.class)
    @Column(name = "BEGINNING_SALARY")
    private String beginningSalary;

    @Convert(converter = SalaryEncryptor.class)
    @Column(name = "MAX_SALARY")
    private String maxSalary;

    @ManyToOne
    @JoinColumn(name = "JOB_GRADE_ID", referencedColumnName = "ID")
    private HrLuJobGrade jobGrade;

    @ManyToOne
    @JoinColumn(name = "ICF_ID", referencedColumnName = "ID")
    private HR_LuIcf icf;

    // Constructors
    public HR_Rank() {
    }

    public HR_Rank(Long rankId, String beginningSalary, String maxSalary, HrLuJobGrade jobGrade, HR_LuIcf icf) {
        this.rankId = rankId;
        this.beginningSalary = beginningSalary;
        this.maxSalary = maxSalary;
        this.jobGrade = jobGrade;
        this.icf = icf;
    }

    // Getters and Setters
    public Long getRankId() {
        return rankId;
    }

    public void setRankId(Long rankId) {
        this.rankId = rankId;
    }

    public String getBeginningSalary() {
        return beginningSalary;
    }

    public void setBeginningSalary(String beginningSalary) {
        this.beginningSalary = beginningSalary;
    }

    public String getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(String maxSalary) {
        this.maxSalary = maxSalary;
    }

    public HrLuJobGrade getJobGrade() {
        return jobGrade;
    }

    public void setJobGrade(HrLuJobGrade jobGrade) {
        this.jobGrade = jobGrade;
    }

    public HR_LuIcf getIcf() {
        return icf;
    }

    public void setIcf(HR_LuIcf icf) {
        this.icf = icf;
    }
}
