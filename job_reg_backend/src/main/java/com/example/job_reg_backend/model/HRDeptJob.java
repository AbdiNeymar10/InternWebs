package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_DEPT_JOB")
public class HRDeptJob {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_dept_job_seq")
    @SequenceGenerator(name = "hr_dept_job_seq", sequenceName = "HR_DEPT_JOB_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NO_OF_EMP")
    private Integer noOfEmployees;

    @ManyToOne
    @JoinColumn(name = "DEPT_ID", referencedColumnName = "DEPT_ID", nullable = false)
    private Department department; 

    @ManyToOne
    @JoinColumn(name = "JOB_TYPE_ID", referencedColumnName = "ID", nullable = false)
    private HRJobType jobType;

    // Constructors
    public HRDeptJob() {}

    public HRDeptJob(Long id, Integer noOfEmployees, Department department, HRJobType jobType) {
        this.id = id;
        this.noOfEmployees = noOfEmployees;
        this.department = department;
        this.jobType = jobType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNoOfEmployees() {
        return noOfEmployees;
    }

    public void setNoOfEmployees(Integer noOfEmployees) {
        this.noOfEmployees = noOfEmployees;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public HRJobType getJobType() {
        return jobType;
    }

    public void setJobType(HRJobType jobType) {
        this.jobType = jobType;
    }
}