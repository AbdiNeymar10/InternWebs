package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "HR_POWER_DELEGATION")
@Data
public class HrPowerDelegation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_power_delegation_seq_gen")
    @SequenceGenerator(
            name = "hr_power_delegation_seq_gen",
            sequenceName = "HR_POWER_DELEGATION_SEQ", // The name of your database sequence
            schema = "INSAHR", // Schema where the sequence exists
            allocationSize = 1 // Standard allocation size
    )
    @Column(name = "ID")
    private Long id;

    @Column(name = "FROM_DATE")
    @Temporal(TemporalType.DATE)
    private Date fromDate;

    @Column(name = "TO_DATE")
    private String toDate;

    @Column(name = "REQUESTER_NOTICE", length = 200)
    private String requesterNotice;

    @Column(name = "DOCT_RETE", length = 45)
    private String doctRete;

    @Column(name = "STATUS", length = 45)
    private String status;

    @Column(name = "DELEGATEE_ID", length = 20)
    private String delegateeId;

    @Column(name = "DELEGATOR_ID", length = 255)
    private String delegatorId;

    @Column(name = "APPROVED_BY", length = 255)
    private String approvedBy;

    @Column(name = "APPROVED_DATE", length = 200)
    private String approvedDate;

    @Column(name = "APPROVER_DESC", length = 255)
    private String approverDesc;

    @Column(name = "EFFECTIVE_MONTH", length = 200)
    private String effectiveMonth;

    @Column(name = "JOB_POSITION", length = 200)
    private String jobPosition;

    @Column(name = "REQUEST_DATE", length = 200)
    private String requestDate;

    @Column(name = "UPDATED_BY", length = 200)
    private String updatedBy;

    @Column(name = "UPDATED_DATE", length = 200)
    private String updatedDate;

    @Column(name = "UPDATOR_REMARK", length = 255)
    private String updatorRemark;

    @Column(name = "START_DATE", length = 200)
    private String startDate;
}