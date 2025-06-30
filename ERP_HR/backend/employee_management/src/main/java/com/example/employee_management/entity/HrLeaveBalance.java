package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LEAVE_BALANCE")
public class HrLeaveBalance {

    @Id
    @Column(name = "BALANCE_ID")
    private Long balanceId;

    @Column(name = "EMPLOYEE_ID")
    private String employeeId;

    @ManyToOne
    @JoinColumn(name = "LEAVE_YEAR_ID", referencedColumnName = "ID")
    private HrLuLeaveYear leaveYear;

    @ManyToOne
    @JoinColumn(name = "LEAVE_TYPE_ID", referencedColumnName = "ID")
    private HrLuLeaveType leaveType;

    @Column(name = "TOTAL_DAYS")
    private Float totalDays;

    @Column(name = "REMAINING_DAYS")
    private Float remainingDays;

    @Column(name = "INITIAL_BALANCE")
    private Float initialBalance;

    @Column(name = "USED_DAYS")
    private Float usedDays;

    // Getters and Setters
    public Long getBalanceId() { return balanceId; }
    public void setBalanceId(Long balanceId) { this.balanceId = balanceId; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public HrLuLeaveYear getLeaveYear() { return leaveYear; }
    public void setLeaveYear(HrLuLeaveYear leaveYear) { this.leaveYear = leaveYear; }
    public HrLuLeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(HrLuLeaveType leaveType) { this.leaveType = leaveType; }
    public Float getTotalDays() { return totalDays; }
    public void setTotalDays(Float totalDays) { this.totalDays = totalDays; }
    public Float getRemainingDays() { return remainingDays; }
    public void setRemainingDays(Float remainingDays) { this.remainingDays = remainingDays; }
    public Float getInitialBalance() { return initialBalance; }
    public void setInitialBalance(Float initialBalance) { this.initialBalance = initialBalance; }
    public Float getUsedDays() { return usedDays; }
    public void setUsedDays(Float usedDays) { this.usedDays = usedDays; }

    public Object getCurrentBalance() {
        return null;
    }
}