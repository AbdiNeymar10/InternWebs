package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_SEPARATION_FILE_UPLOAD") // Ensure this matches your table name
public class SeparationFileUpload {

    @Id
    @Column(name = "UPLOAD_ID", length = 20, nullable = false)
    private String uploadId;

    @Column(name = "FILE_NAME", length = 150)
    private String fileName;

    @Lob // For BLOB type
    @Column(name = "UPLOAD_FILE")
    private byte[] uploadFile;

    @Column(name = "FILE_TYPE", length = 50)
    private String fileType;

    @Column(name = "SEPARATION_ID", length = 20) // Foreign key to EmployeeSeparation
    private String separationId;

    // ORDER_PAYMENT_ID and RETIREMENT_REQUESTER_ID seem specific.
    // If they are not always related to a general separation file,
    // you might make them nullable or handle them based on context.
    // For now, I'll include them as nullable.
    @Column(name = "ORDER_PAYMENT_ID", length = 20)
    private String orderPaymentId;

    @Column(name = "RETIREMENT_REQUESTER_ID", length = 20)
    private String retirementRequesterId;

    // Getters and Setters
    public String getUploadId() {
        return uploadId;
    }

    public void setUploadId(String uploadId) {
        this.uploadId = uploadId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getUploadFile() {
        return uploadFile;
    }

    public void setUploadFile(byte[] uploadFile) {
        this.uploadFile = uploadFile;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getSeparationId() {
        return separationId;
    }

    public void setSeparationId(String separationId) {
        this.separationId = separationId;
    }

    public String getOrderPaymentId() {
        return orderPaymentId;
    }

    public void setOrderPaymentId(String orderPaymentId) {
        this.orderPaymentId = orderPaymentId;
    }

    public String getRetirementRequesterId() {
        return retirementRequesterId;
    }

    public void setRetirementRequesterId(String retirementRequesterId) {
        this.retirementRequesterId = retirementRequesterId;
    }
}