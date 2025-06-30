package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "HR_LU_LEAVE_YEAR")
public class HrLuLeaveYear {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "LYEAR")
    private String lyear;

    @Column(name = "STATUS")
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLyear() { return lyear; }
    public void setLyear(String lyear) { this.lyear = lyear; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}