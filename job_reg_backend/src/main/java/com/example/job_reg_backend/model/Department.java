package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_DEPARTMENT")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "HR_DEPARTMENT_DEPT_ID_SEQ")
    @SequenceGenerator(name = "HR_DEPARTMENT_DEPT_ID_SEQ", sequenceName = "HR_DEPARTMENT_DEPT_ID_SEQ", allocationSize = 1)
    @Column(name = "DEPT_ID")
    private Long deptId;

    @Column(name = "DEP_NAME")
    private String depName;

    @Column(name = "DEPT_LEVEL")
    private Integer deptLevel;
               
    // Changed estDate type to String
    @Column(name = "EST_DATE")
    private String estDate; // Now stored as String

    @Column(name = "MISSION")
    private String mission;

    @Column(name = "VISION")
    private String vision;

    @Column(name = "STATUS")
    private Long status;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "TELE1")
    private String tele1;

    @Column(name = "TELE2")
    private String tele2;

    @Column(name = "POBOX")
    private String poBox;

    // Getters and Setters for all fields
    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public String getDepName() {
        return depName;
    }

    public void setDepName(String depName) {
        this.depName = depName;
    }

    public Integer getDeptLevel() {
        return deptLevel;
    }

    public void setDeptLevel(Integer deptLevel) {
        this.deptLevel = deptLevel;
    }

    public String getEstDate() {
        return estDate;
    }

    public void setEstDate(String estDate) {
        this.estDate = estDate;
    }

    public String getMission() {
        return mission;
    }

    public void setMission(String mission) {
        this.mission = mission;
    }

    public String getVision() {
        return vision;
    }

    public void setVision(String vision) {
        this.vision = vision;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTele1() {
        return tele1;
    }

    public void setTele1(String tele1) {
        this.tele1 = tele1;
    }

    public String getTele2() {
        return tele2;
    }

    public void setTele2(String tele2) {
        this.tele2 = tele2;
    }

    public String getPoBox() {
        return poBox;
    }

    public void setPoBox(String poBox) {
        this.poBox = poBox;
    }
}
