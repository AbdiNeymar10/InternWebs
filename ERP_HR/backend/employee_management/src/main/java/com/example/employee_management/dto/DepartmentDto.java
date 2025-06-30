package com.example.employee_management.dto;

import com.example.employee_management.entity.Department;

public class DepartmentDto {
    private Long deptId;
    private String deptName;
    private int deptLevel;
    private String email;
    private String estDate;
    private String mission;
    private String vision;
    private String poBox;
    private String status;
    private String tele1;
    private String tele2;

    // Convert Department entity to DepartmentDto
    public static DepartmentDto fromEntity(Department d) {
        DepartmentDto dto = new DepartmentDto();
        dto.setDeptId(d.getDeptId());
        dto.setDeptName(d.getDepName());
        dto.setDeptLevel(d.getDeptLevel());
        dto.setEmail(d.getEmail());
        dto.setEstDate(d.getEstDate());
        dto.setMission(d.getMission());
        dto.setVision(d.getVision());
        dto.setPoBox(d.getPoBox());
        dto.setStatus(d.getStatus() != null ? d.getStatus().toString() : null);
        dto.setTele1(d.getTele1());
        dto.setTele2(d.getTele2());
        return dto;
    }

    // Convert DepartmentDto to Department entity (for create/update)
    public Department toEntity() {
        Department d = new Department();
        d.setDeptId(this.deptId); // important for update
        d.setDepName(this.deptName);
        d.setDeptLevel(this.deptLevel);
        d.setEmail(this.email);
        d.setEstDate(this.estDate);
        d.setMission(this.mission);
        d.setVision(this.vision);
        d.setPoBox(this.poBox);
        d.setStatus(this.status != null ? Long.valueOf(this.status) : null);
        d.setTele1(this.tele1);
        d.setTele2(this.tele2);
        return d;
    }

    // Getters and setters for all fields
    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public int getDeptLevel() {
        return deptLevel;
    }

    public void setDeptLevel(int deptLevel) {
        this.deptLevel = deptLevel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getPoBox() {
        return poBox;
    }

    public void setPoBox(String poBox) {
        this.poBox = poBox;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
