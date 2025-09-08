package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
// import java.time.LocalDate;

@Data
@Entity
@Table(name = "HR_RECRUITMENT_REQUEST")
public class RecruitmentRequest {

        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "recruit_req_seq_gen")
        @SequenceGenerator(name = "recruit_req_seq_gen", sequenceName = "HR_RECRUIT_REQ_SEQ", allocationSize = 1)
        @Column(name = "RECRUIT_REQUEST_ID", precision = 10, scale = 0)
        private Long recruitRequestId;

        @Column(name = "GM_REMARK", length = 255)
        private String gmRemark;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "DEPARTMENT_ID", referencedColumnName = "DEPT_ID")
        private Department department;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "JOB_CODE", referencedColumnName = "ID")
        private HrJobTypeDetail jobCodeDetail;

        @Transient // This field is not persisted to the database
        private Integer jobTypeId;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "ICF", referencedColumnName = "ID")
        private HrLuIcf icf;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "JOB_RESPONSIBILITY", referencedColumnName = "ID")
        private HrLuResponsibility jobResponsibility;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "POSITION_NAME", referencedColumnName = "ID")
        private HrLuPositionName positionName;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "RECRUITMENT_TYPE", referencedColumnName = "RECRUITMENT_TYPE")
        private HrLuRecruitmentType recruitmentType;

        @Column(name = "NUM_OF_EMPS", precision = 10, scale = 0)
        private Long numOfEmps;

        @Column(name = "GM_EMPS_APPROVED", length = 100)
        private String gmEmpsApproved;

        @Column(name = "RECRUIT_BATCH_CODE", length = 255)
        private String recruitBatchCode;

        @Column(name = "GM_APPROVED_DATE", length = 200)
        private String gmApprovedDate;

        @Column(name = "RECRUIT_REQUEST_TYPE", length = 255)
        private String recruitRequestType;

        @Column(name = "REMARK", length = 255)
        private String remark;

        @Column(name = "REQUEST_STATUS", length = 255)
        private String requestStatus;

        @Column(name = "REQUESTER_ID", nullable = false, length = 255)
        private String requesterId;

        @Column(name = "APPROVED_BY", length = 555)
        private String approvedBy;

        @Column(name = "UPDATEDDATE", length = 200)
        private String updatedDate;

        @Column(name = "END_DATE", length = 200)
        private String endDate;

        @Column(name = "BUDGETYEAR", length = 20)
        private String budgetYear;

        @Column(name = "ADVERTISEMENT_TYPE", length = 255)
        private String advertisementType;

        @Column(name = "SELECTION_REMARK", length = 4000)
        private String selectionRemark;

        @Column(name = "ADVERTIZED", length = 20)
        private String advertized;

        @Column(name = "CHECKED", nullable = false, length = 200)
        private String checked;

        @Column(name = "DESCRIPTION", length = 200)
        private String description;

        @Column(name = "PAY_GRADE")
        private BigDecimal payGrade;

        @Column(name = "RANK")
        private BigDecimal rank;

        @Column(name = "SALARY", length = 200)
        private String salary;

        @Transient
        private String incrementStep;

        // ✅ MODIFIED: Changed to transient ID and Name fields
        @Transient
        private Long employmentTypeId;
        @Transient
        private String employmentTypeName;
}