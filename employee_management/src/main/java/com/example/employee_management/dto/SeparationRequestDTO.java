package com.example.employee_management.dto;

public class SeparationRequestDTO {
    private String separationTypeId;
    private String requestDate; // This will serve for both request and prepared date
    private String resignationDate;
    private String description;
    private String employeeId;
    private String comment;
    private String preparedBy;
    // private String preparedDate; // Removed
    private String remark;
    private String supportiveFileName;
    private String terminationType;
    private String noOfDayLeft;
    private String remainingReason;
    private String dayLeft;

    // Getters and Setters
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

    public String getPreparedBy() {
        return preparedBy;
    }

    public void setPreparedBy(String preparedBy) {
        this.preparedBy = preparedBy;
    }

    // Removed getPreparedDate() and setPreparedDate()

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