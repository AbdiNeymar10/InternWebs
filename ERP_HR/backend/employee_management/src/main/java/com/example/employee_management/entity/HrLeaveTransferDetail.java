// HrLeaveTransferDetail.java - Replace entire file
package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LEAVE_TRANSFER_DETAIL")
public class HrLeaveTransferDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lve_trnsfr_dtl_id_seq_gen")
    @SequenceGenerator(
        name = "hr_lve_trnsfr_dtl_id_seq_gen",
        sequenceName = "HR_LVE_TRNSFR_DTL_ID_SEQ",
        allocationSize = 1
    )
    @Column(name = "DETAIL_ID")
    private Long detailId;

    @Column(name = "EMP_ID", nullable = false)
    private String empId;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "APPROVER_NOTES", length = 500)
    private String approverNotes;

    @ManyToOne
    @JoinColumn(name = "REQUEST_MASTER_ID", nullable = false)
    private HrLeaveTransfer leaveTransfer;

    @Column(name = "REQUEST_ID")
    private String requestId;

    // Getters and Setters
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

    public String getApproverNotes() {
        return approverNotes;
    }

    public void setApproverNotes(String approverNotes) {
        this.approverNotes = approverNotes;
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