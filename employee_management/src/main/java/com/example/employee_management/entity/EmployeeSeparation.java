package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "HR_EMPLOYEE_SEPARATION")
public class EmployeeSeparation {
    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "SEPARATION_TYPE_ID")
    private String separationTypeId;

    @Column(name = "REQUEST_DATE") // This column will store both request and prepared date
    private String requestDate;

    @Column(name = "RESIGNATION_DATE")
    private String resignationDate;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "EMP_ID")
    private String employeeId;

    @Column(name = "GIVE_COMMENT")
    private String comment;

    @Column(name = "STATUS")
    private Integer status;

    @Column(name = "PREPARED_BY")
    private String preparedBy;

    // REMOVE the separate preparedDate field and its @Column mapping
    // @Column(name = "PREPARED_DATE")
    // private String preparedDate;

    @Column(name = "REMARK")
    private String remark;

    @Column(name = "SUPPORTIVE_FILE_NAME")
    private String supportiveFileName;

    @Column(name = "TERMINATION_DEPT_STATUS")
    private Integer terminationDeptStatus;

    @Column(name = "TERMINATION_TYPE")
    private String terminationType;

    @Column(name = "NO_OF_DAY_LEFT")
    private String noOfDayLeft;

    @Column(name = "REMAINING_REASON")
    private String remainingReason;

    @Column(name = "DAY_LEFT")
    private String dayLeft;

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSeparationTypeId() {
        return separationTypeId;
    }

    public void setSeparationTypeId(String separationTypeId) {
        this.separationTypeId = separationTypeId;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }

    public String getResignationDate() {
        return resignationDate;
    }

    public void setResignationDate(String resignationDate) {
        this.resignationDate = resignationDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getPreparedBy() {
        return preparedBy;
    }

    public void setPreparedBy(String preparedBy) {
        this.preparedBy = preparedBy;
    }

    // REMOVE getPreparedDate() and setPreparedDate()
    // public String getPreparedDate() {
    //     return preparedDate;
    // }
    //
    // public void setPreparedDate(String preparedDate) {
    //     this.preparedDate = preparedDate;
    // }


    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getSupportiveFileName() {
        return supportiveFileName;
    }

    public void setSupportiveFileName(String supportiveFileName) {
        this.supportiveFileName = supportiveFileName;
    }

    public Integer getTerminationDeptStatus() {
        return terminationDeptStatus;
    }

    public void setTerminationDeptStatus(Integer terminationDeptStatus) {
        this.terminationDeptStatus = terminationDeptStatus;
    }

    public String getTerminationType() {
        return terminationType;
    }

    public void setTerminationType(String terminationType) {
        this.terminationType = terminationType;
    }

    public String getNoOfDayLeft() {
        return noOfDayLeft;
    }

    public void setNoOfDayLeft(String noOfDayLeft) {
        this.noOfDayLeft = noOfDayLeft;
    }

    public String getRemainingReason() {
        return remainingReason;
    }

    public void setRemainingReason(String remainingReason) {
        this.remainingReason = remainingReason;
    }

    public String getDayLeft() {
        return dayLeft;
    }

    public void setDayLeft(String dayLeft) {
        this.dayLeft = dayLeft;
    }
}