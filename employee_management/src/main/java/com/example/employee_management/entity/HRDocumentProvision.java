package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_DOCUMENT_PROVISION")
public class HRDocumentProvision {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_document_provision_seq")
    @SequenceGenerator(name = "hr_document_provision_seq", sequenceName = "hr_document_provision_seq", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "DOCUMENT_TYPE_ID", referencedColumnName = "ID")
    private HrLuDocumentType documentType;

    @Column(name = "REQUESTER")
    private String requester;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "REQUESTED_DATE")
    private String requestedDate;

    @Column(name = "REMARK")
    private String remark;

    @Column(name = "REFERENCE_NO")
    private String referenceNo;

    @Column(name = "DROPPED_BY")
    private String droppedBy;

    @Column(name = "DROPPED_DATE")
    private String droppedDate;

    @Column(name = "DROPER_REMARK")
    private String droperRemark;

    @Column(name = "APPROVED_REF_NO")
    private String approvedRefNo;

    @Column(name = "WARRANTY_FOR_EMPLOYEE")
    private String warrantyForEmployee;

    @Column(name = "WARRANTY_FOR_ORG")
    private String warrantyForOrg;

    @Column(name = "APPROVE_DATE")
    private String approveDate;

    @Column(name = "WORK_ID")
    private String workId;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HrLuDocumentType getDocumentType() { return documentType; }
    public void setDocumentType(HrLuDocumentType documentType) { this.documentType = documentType; }
    public String getRequester() { return requester; }
    public void setRequester(String requester) { this.requester = requester; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRequestedDate() { return requestedDate; }
    public void setRequestedDate(String requestedDate) { this.requestedDate = requestedDate; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    public String getDroppedBy() { return droppedBy; }
    public void setDroppedBy(String droppedBy) { this.droppedBy = droppedBy; }
    public String getDroppedDate() { return droppedDate; }
    public void setDroppedDate(String droppedDate) { this.droppedDate = droppedDate; }
    public String getDroperRemark() { return droperRemark; }
    public void setDroperRemark(String droperRemark) { this.droperRemark = droperRemark; }
    public String getApprovedRefNo() { return approvedRefNo; }
    public void setApprovedRefNo(String approvedRefNo) { this.approvedRefNo = approvedRefNo; }
    public String getWarrantyForEmployee() { return warrantyForEmployee; }
    public void setWarrantyForEmployee(String warrantyForEmployee) { this.warrantyForEmployee = warrantyForEmployee; }
    public String getWarrantyForOrg() { return warrantyForOrg; }
    public void setWarrantyForOrg(String warrantyForOrg) { this.warrantyForOrg = warrantyForOrg; }
    public String getApproveDate() { return approveDate; }
    public void setApproveDate(String approveDate) { this.approveDate = approveDate; }
    public String getWorkId() { return workId; }
    public void setWorkId(String workId) { this.workId = workId; }
}