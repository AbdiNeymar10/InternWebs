package com.example.employee_management.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "HR_LEAVE_TRANSFER")
public class HrLeaveTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_leave_transfer_seq_gen")
    @SequenceGenerator(name = "hr_leave_transfer_seq_gen", sequenceName = "HR_LEAVE_TRANSFER_ID_SEQ", allocationSize = 1)
    @Column(name = "TRANSFER_ID")
    private Long transferId;

    @Column(name = "REQUESTER_ID", nullable = false)
    private String requesterId;

    @Column(name = "BUDGET_YEAR")
    private Integer budgetYear;

    @Column(name = "CREATED_DATE")
    private LocalDateTime createdDate;

    @OneToMany(mappedBy = "leaveTransfer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HrLeaveTransferDetail> details = new ArrayList<>();

    // Getters and Setters
    public Long getTransferId() {
        return transferId;
    }

    public void setTransferId(Long transferId) {
        this.transferId = transferId;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }

    public Integer getBudgetYear() {
        return budgetYear;
    }

    public void setBudgetYear(Integer budgetYear) {
        this.budgetYear = budgetYear;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public List<HrLeaveTransferDetail> getDetails() {
        return details;
    }

    public void setDetails(List<HrLeaveTransferDetail> details) {
        this.details = details;
    }
}