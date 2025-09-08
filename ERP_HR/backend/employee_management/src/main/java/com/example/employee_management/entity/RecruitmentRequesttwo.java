package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "HR_RECRUITMENT_REQUEST")
public class RecruitmentRequesttwo {

        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "recruit_req_seq_gen")
        @SequenceGenerator(name = "recruit_req_seq_gen", sequenceName = "HR_RECRUIT_REQ_SEQ", allocationSize = 1)
        @Column(name = "RECRUIT_REQUEST_ID", precision = 10, scale = 0)
        private Long recruitRequestId;

        @Column(name = "GM_REMARK", length = 255)
        private String gmRemark;

        // --- Relationships based on provided entities ---

        @ManyToOne
        @JoinColumn(name = "DEPARTMENT_ID", referencedColumnName = "DEPT_ID")
        private Department department;

        // MODIFIED: JOB_CODE now links to HR_JOB_TYPE_DETAIL.ID
        @ManyToOne
        @JoinColumn(name = "JOB_CODE", referencedColumnName = "ID")
        private HrJobTypeDetail jobCodeDetail; // Renamed to clearly indicate it's the detail

        @ManyToOne
        @JoinColumn(name = "ICF", referencedColumnName = "ID") // Assuming 'ID' is the primary key of HrLuIcf
        private HrLuIcf icf;

        // Assuming these entities exist and are correctly mapped
        @ManyToOne
        @JoinColumn(name = "JOB_RESPONSIBILITY", referencedColumnName = "ID")
        private HrLuResponsibility jobResponsibility;

        @ManyToOne
        @JoinColumn(name = "POSITION_NAME", referencedColumnName = "ID")
        private HrLuPositionName positionName;

        @ManyToOne
        @JoinColumn(name = "RECRUITMENT_TYPE", referencedColumnName = "RECRUITMENT_TYPE")
        private HrLuRecruitmentType recruitmentType;

        // --- Other existing fields ---

        @Column(name = "NUM_OF_EMPS", precision = 10, scale = 0)
        private Long numOfEmps;

        @Column(name = "GM_EMPS_APPROVED", length = 100)
        private String gmEmpsApproved;

        @Column(name = "RECRUIT_BATCH_CODE", length = 255)
        private String recruitBatchCode;

        @Column(name = "GM_APPROVED_DATE", length = 200)
        private String gmApprovedDate; // Keep as String for now, convert in service

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
        private String updatedDate; // Keep as String for now, convert in service

        @Column(name = "END_DATE", length = 200)
        private String endDate; // Keep as String for now, convert in service

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
        private String salary; // Keep as String for now, convert in service

        public void setGmApprovedDate(LocalDate now) {
        }

        public void setUpdatedDate(LocalDate now) {
        }

        public HrJobType getJobType() {
                return null;
        }

        public void setJobType(Object o) {
        }

        // Lombok @Data will generate getters/setters.
        // If not using Lombok, you'd need to add them manually.
}