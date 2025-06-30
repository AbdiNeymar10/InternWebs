package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LEAVE_TRANSFER_DETAIL")
public class HrLeaveTransferDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lve_trnsfr_dtl_id_seq_gen") // Shortened generator name
    @SequenceGenerator(
        name = "hr_lve_trnsfr_dtl_id_seq_gen", // Shortened generator name
        sequenceName = "HR_LVE_TRNSFR_DTL_ID_SEQ", // Shortened sequence name (27 characters)
        allocationSize = 1
    )
    @Column(name = "DETAIL_ID")
    private Long detailId;

    @Column(name = "EMP_ID", nullable = false)
    private String empId;

    @Column(name = "STATUS")
    private String status;

    @ManyToOne
    @JoinColumn(name = "REQUEST_MASTER_ID", nullable = false)
    private HrLeaveTransfer leaveTransfer;

    @Column(name = "REQUEST_ID")
    private String requestId;

    // Getters and Setters (unchanged)
    public Long getDetailId() {
        return detailId;
    }

    public void setDetailId(Long detailId) {
        this.detailId = detailId;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public HrLeaveTransfer getLeaveTransfer() {
        return leaveTransfer;
    }

    public void setLeaveTransfer(HrLeaveTransfer leaveTransfer) {
        this.leaveTransfer = leaveTransfer;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
}