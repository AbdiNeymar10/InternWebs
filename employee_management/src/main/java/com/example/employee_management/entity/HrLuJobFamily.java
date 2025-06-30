package com.example.employee_management.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "HR_LU_JOBFAMILY")
public class HrLuJobFamily {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_job_family_seq")
    @SequenceGenerator(name = "hr_lu_job_family_seq", sequenceName = "HR_LU_JOB_FAMILY_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Integer id;

    @NotBlank(message = "Family code is required")
    @Size(max = 20, message = "Family code must be at most 20 characters")
    @Column(name = "FAMILYCODE", nullable = false, length = 20)
    private String familyCode;

    @Size(max = 20, message = "Status must be at most 20 characters")
    @Column(name = "STATUS", length = 20)
    private String status = "1"; // Default value as per schema

    @NotBlank(message = "Family name is required")
    @Size(max = 255, message = "Family name must be at most 255 characters")
    @Column(name = "FAMILY_NAME", nullable = false, length = 255)
    private String familyName;

    // Constructors
    public HrLuJobFamily() {
    }

    public HrLuJobFamily(Integer id, String familyCode, String status, String familyName) {
        this.id = id;
        this.familyCode = familyCode;
        this.status = status;
        this.familyName = familyName;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFamilyCode() {
        return familyCode;
    }

    public void setFamilyCode(String familyCode) {
        this.familyCode = familyCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    @Override
    public String toString() {
        return "HrLuJobFamily{" +
                "id=" + id +
                ", familyCode='" + familyCode + '\'' +
                ", status='" + status + '\'' +
                ", familyName='" + familyName + '\'' +
                '}';
    }
}
