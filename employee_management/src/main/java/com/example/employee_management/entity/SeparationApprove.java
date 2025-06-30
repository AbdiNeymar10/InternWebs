package com.example.employee_management.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "HR_EMP_SEPARATION_APPROVE")
public class SeparationApprove {
    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "SEPRATION_REQUEST_ID")
    private String separationRequestId;

    @Column(name = "WAITING_DAYS")
    private String waitingDays;

    @Column(name = "ADDITIONAL_WAITING_DAYS")
    private String additionalWaitingDays;

    @Column(name = "EMP_ID")
    private String employeeId;

    @Column(name = "REMARK")
    private String remark;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSeparationRequestId() {
        return separationRequestId;
    }

    public void setSeparationRequestId(String separationRequestId) {
        this.separationRequestId = separationRequestId;
    }

    public String getWaitingDays() {
        return waitingDays;
    }

    public void setWaitingDays(String waitingDays) {
        this.waitingDays = waitingDays;
    }

    public String getAdditionalWaitingDays() {
        return additionalWaitingDays;
    }

    public void setAdditionalWaitingDays(String additionalWaitingDays) {
        this.additionalWaitingDays = additionalWaitingDays;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
