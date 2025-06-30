package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "HR_EMP_EXPERIENCE")
@Data
public class EmpExperience {

    @Id
    @Column(name = "EMP_EXPE_ID", columnDefinition = "NUMBER(10)")
    private Long empExpeId;

    @Column(name = "EMP_ID", length = 255, insertable = false, updatable = false)
    private String empId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID")
    @JsonIgnore
    private HrEmployee employee;

    @Column(name = "EMPLOYMENT_TYPE", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String employmentType;

    @Column(name = "INSTITUTION", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String institution;

    @Column(name = "JOB_TITLE", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String jobTitle;

    @Column(name = "ORGANIZATION_TYPE", length = 255)
    private String organizationType;

    @Column(name = "REASON_FOR_TERMINATION", length = 255)
    private String reasonForTermination;

    @Column(name = "RESPONSIBILITY", length = 255)
    private String responsibility;

    @Column(name = "SALARY", precision = 19, scale = 0)
    private BigDecimal salary;

    @Column(name = "INTERNAL", columnDefinition = "NUMBER(7)")
    private Integer internal;

    @Column(name = "START_DATE", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String startDate;

    @Column(name = "END_DATE", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String endDate;

    @Column(name = "DURATION", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String duration;

    @Column(name = "EXP_ID", columnDefinition = "NUMBER(19)")
    private Long expId;

    @Column(name = "CURRENT_JOB_FLAG", length = 255, columnDefinition = "VARCHAR2(255 CHAR)", nullable = false)
    private String currentJobFlag;

    @Column(name = "ORG_TYPE", length = 255, columnDefinition = "VARCHAR2(255 CHAR)", nullable = false)
    private String orgType;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.empId = employee.getEmpId();
        } else {
            this.empId = null;
        }
    }
}