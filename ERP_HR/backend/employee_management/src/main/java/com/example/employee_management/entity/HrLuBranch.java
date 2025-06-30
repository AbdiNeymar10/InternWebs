package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_BRANCH")
public class HrLuBranch {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "BRANCH_NAME", length = 255)
    private String branchName;

    @Column(name = "PERCENTAGE", length = 100)
    private String percentage;

    // Constructors
    public HrLuBranch() {
    }

    public HrLuBranch(Long id, String branchName, String percentage) {
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

    // toString
    @Override
    public String toString() {
        return "HrLuBranch{" +
                "id=" + id +
                ", branchName='" + branchName + '\'' +
                ", percentage='" + percentage + '\'' +
                '}';
    }
}
