package com.example.employee_management.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "HR_LEAVE_HISTORY")
public class LeaveHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_leave_history_seq_gen")
    @SequenceGenerator(name = "hr_leave_history_seq_gen", sequenceName = "HR_LEAVE_HISTORY_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emp_id", referencedColumnName = "EMP_ID") // Corrected to EMP_ID
    private Employee employee;

    @Column(name = "YEAR", length = 4)
    private String year;

    @Column(name = "FROM_DATE")
    private LocalDate fromDate;

    @Column(name = "TO_DATE")
    private LocalDate toDate;

    @Column(name = "AVAILABLE_DAY")
    private Integer availableDays;

    @Column(name = "STATUS", length = 255)
    private String status;

    @Column(name = "APPROVED_BY", length = 255)
    private String approvedBy;

    @Column(name = "LEAVE_TYPE_ID")
    private Long leaveTypeId; // This remains as Long

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @Column(name = "PAYMENT", length = 255)
    private String payment;

    @Column(name = "EXPIRY", length = 255)
    private String expiry;

    @Column(name = "REQUESTED_DATE")
    private LocalDate requestedDate;

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

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public Integer getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(Integer availableDays) {
        this.availableDays = availableDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public Long getLeaveTypeId() {
        return leaveTypeId;
    }

    public void setLeaveTypeId(Long leaveTypeId) {
        this.leaveTypeId = leaveTypeId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public String getExpiry() {
        return expiry;
    }

    public void setExpiry(String expiry) {
        this.expiry = expiry;
    }

    public LocalDate getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(LocalDate requestedDate) {
        this.requestedDate = requestedDate;
    }
}