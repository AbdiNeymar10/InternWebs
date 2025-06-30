package com.example.employee_management.dto;

import jakarta.validation.constraints.NotNull;

public class LeaveBalanceUpdateDTO {
    @NotNull
    private Float currentBalance;

    @NotNull
    private Float usedDays;

    private String remark; // Assuming remark is a String

    // Getters and setters
    public Float getCurrentBalance() {
        return this.currentBalance;
    }

    public void setCurrentBalance(Float currentBalance) {
        this.currentBalance = currentBalance;
    }

    public Float getUsedDays() {
        return this.usedDays;
    }

    public void setUsedDays(Float usedDays) {
        this.usedDays = usedDays;
    }

    public String getRemark() {
        return this.remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}