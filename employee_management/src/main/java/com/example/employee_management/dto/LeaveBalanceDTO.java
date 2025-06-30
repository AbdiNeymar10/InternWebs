package com.example.employee_management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class LeaveBalanceDTO {
    // Added missing fields
    private Long balanceId; // Include if the DTO is used for updates where ID is known
    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotNull(message = "Leave year is required")
    private Integer leaveYear;

    // Assuming leaveYearId and leaveTypeId are Long based on LeaveBalance entity
    private Long leaveYearId;
    private Long leaveTypeId;

    @NotNull(message = "Initial balance is required")
    @PositiveOrZero(message = "Initial balance must be positive or zero")
    private Float initialBalance;

    @NotNull(message = "Current balance is required")
    // Removed @PositiveOrZero as current balance can be negative if overdrawn
    private Float currentBalance;

    @NotNull(message = "Used days is required")
    @PositiveOrZero(message = "Used days must be positive or zero")
    private Float usedDays;

    // Assuming status, transferStatus, dataDefault, nullable are Integer
    private Integer status;
    private Integer transferStatus;
    private Integer dataDefault;
    private Integer nullable;

    // Assuming recordDate is LocalDate in DTO for easier handling, will format to String in service
    private LocalDate recordDate;

    // Assuming totalDays, remainingDays, columnId are Float
    private Float totalDays;
    private Float remainingDays;
    private Float columnId;

    // Assuming columnName2 is Long
    private Long columnName2;

    // Assuming comments, dataType, dataType2 are String
    private String comments;
    private String dataType;
    private String dataType2;


    // Getters and Setters - Ensure correct types
    public Long getBalanceId() {
        return balanceId;
    }

    public void setBalanceId(Long balanceId) {
        this.balanceId = balanceId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getLeaveYear() {
        return leaveYear;
    }

    public void setLeaveYear(Integer leaveYear) {
        this.leaveYear = leaveYear;
    }

    // Corrected return type
    public Long getLeaveYearId() {
        return leaveYearId;
    }

    public void setLeaveYearId(Long leaveYearId) {
        this.leaveYearId = leaveYearId;
    }

    // Corrected return type
    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }


    public Float getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(Float initialBalance) {
        this.initialBalance = initialBalance;
    }

    public Float getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(Float currentBalance) {
        this.currentBalance = currentBalance;
    }

    public Float getUsedDays() {
        return usedDays;
    }

    public void setUsedDays(Float usedDays) {
        this.usedDays = usedDays;
    }

    // Corrected return type
    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    // Corrected return type
    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    // Corrected return type
    public Integer getTransferStatus() {
        return transferStatus;
    }

    public void setTransferStatus(Integer transferStatus) {
        this.transferStatus = transferStatus;
    }

    // Corrected return type
    public Float getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(Float remainingDays) {
        this.remainingDays = remainingDays;
    }

    // Corrected return type
    public Float getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Float totalDays) {
        this.totalDays = totalDays;
    }

    // Corrected return type
    public Float getColumnId() {
        return columnId;
    }

    public void setColumnId(Float columnId) {
        this.columnId = columnId;
    }

    // Corrected return type
    public Long getColumnName2() {
        return columnName2;
    }

    public void setColumnName2(Long columnName2) {
        this.columnName2 = columnName2;
    }

    // Corrected return type
    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    // Corrected return type
    public Integer getDataDefault() {
        return dataDefault;
    }

    public void setDataDefault(Integer dataDefault) {
        this.dataDefault = dataDefault;
    }

    // Corrected return type
    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    // Corrected return type
    public String getDataType2() {
        return dataType2;
    }

    public void setDataType2(String dataType2) {
        this.dataType2 = dataType2;
    }

    // Corrected return type
    public Integer getNullable() {
        return nullable;
    }

    public void setNullable(Integer nullable) {
        this.nullable = nullable;
    }
}