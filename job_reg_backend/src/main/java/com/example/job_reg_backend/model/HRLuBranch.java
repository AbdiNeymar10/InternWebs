package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_BRANCH")
public class HRLuBranch {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_branch_seq")
    @SequenceGenerator(name = "hr_lu_branch_seq", sequenceName = "HR_LU_BRANCH_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "BRANCH_NAME")
    private String branchName;

    @Column(name = "PERCENTAGE")
    private String percentage;

    // Constructors
    public HRLuBranch() {}

    public HRLuBranch(Long id, String branchName, String percentage) {
        this.id = id;
        this.branchName = branchName;
        this.percentage = percentage;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getPercentage() {
        return percentage;
    }

    public void setPercentage(String percentage) {
        this.percentage = percentage;
    }
}