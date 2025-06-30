package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LEAVE_REQUEST")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "leave_req_seq")
    @SequenceGenerator(
            name = "leave_req_seq",
            sequenceName = "HR_LEAVE_REQUEST_SEQ",
            allocationSize = 1
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LEAVE_TYPE_ID", referencedColumnName = "ID")
    private HrLuLeaveType leaveType;

    @Column(name = "INCIDENT_TYPE") // This correctly maps to your VARCHAR2 column
    private String incidentType;

    @Column(name = "LEAVE_START", length = 255)
    private String leaveStart;

    @Column(name = "LEAVE_END", length = 255)
    private String leaveEnd;

    @Column(name = "REQUESTED_DAYS")
    private Float requestedDays;

    @Column(name = "DAY_TYPE")
    private String dayType;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DEPT_STATUS")
    private String deptStatus;

    @Column(name = "HR_STATUS")
    private String hrStatus;

    @Column(name = "APPROVED_DAYS", columnDefinition = "BINARY_DOUBLE")
    private Double approvedDays;

    @Column(name = "REMARK")
    private String remark;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public HrLuLeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(HrLuLeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public String getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(String incidentType) { // Correct setter for String
        this.incidentType = incidentType;
    }

    public String getLeaveStart() {
        return leaveStart;
    }

    public void setLeaveStart(String leaveStart) {
        this.leaveStart = leaveStart;
    }

    public String getLeaveEnd() {
        return leaveEnd;
    }

    public void setLeaveEnd(String leaveEnd) {
        this.leaveEnd = leaveEnd;
    }

    public Float getRequestedDays() {
        return requestedDays;
    }

    public void setRequestedDays(Float requestedDays) {
        this.requestedDays = requestedDays;
    }

    public String getDayType() {
        return dayType;
    }

    public void setDayType(String dayType) {
        this.dayType = dayType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeptStatus() {
        return deptStatus;
    }

    public void setDeptStatus(String deptStatus) {
        this.deptStatus = deptStatus;
    }

    public String getHrStatus() {
        return hrStatus;
    }

    public void setHrStatus(String hrStatus) {
        this.hrStatus = hrStatus;
    }

    public Double getApprovedDays() {
        return approvedDays;
    }

    public void setApprovedDays(Double approvedDays) {
        this.approvedDays = approvedDays;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}