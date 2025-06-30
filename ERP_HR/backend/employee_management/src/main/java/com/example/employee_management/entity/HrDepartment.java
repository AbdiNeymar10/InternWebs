package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "HR_DEPARTMENT")
@Getter
@Setter
public class HrDepartment {

    @Id
    @Column(name = "DEPT_ID", nullable = false) // NUMBER(10,0)
    private Long deptId;

    @Column(name = "DEP_NAME") // VARCHAR2(255 CHAR)
    private String depName; // Department's actual name

    @Column(name = "DEPT_LEVEL", nullable = false) // NUMBER(10,0), Not Null
    private Long deptLevel; // Numeric representation of the department level

    @Column(name = "EST_DATE", nullable = false) // VARCHAR2(255 CHAR), Not Null
    private String estDate;

    @Column(name = "MISSION") // VARCHAR2(255 CHAR)
    private String mission;

    @Column(name = "VISION") // VARCHAR2(255 CHAR)
    private String vision;

    @Column(name = "BRANCH_ID") // NUMBER(10,0)
    private Long branchId;

    @Column(name = "STATUS") // NUMBER, Default 0
    private Integer status;

    @Column(name = "LOCATION_ID") // NUMBER(7,0)
    private Long locationId;

    // TITILE_ID seems to be a typo for TITLE_ID
    @Column(name = "TITLE_ID") // NUMBER or NUMBER(19,0) - consistency needed with the second TITLE_ID
    private Long titleId; // Assuming this is the intended one if TITILE_ID is a typo

    @Column(name = "EMAIL") // VARCHAR2(255 CHAR)
    private String email;

    @Column(name = "FAX") // VARCHAR2(255 CHAR)
    private String fax;

    @Column(name = "TELE1") // VARCHAR2(255 CHAR)
    private String tele1;

    // DEPT_NAME is redundant if DEP_NAME is used. Clarify which one is authoritative.
    // For now, I'm assuming DEP_NAME is the primary one.
    // @Column(name = "DEPT_NAME") // VARCHAR2(255 CHAR)
    // private String deptNameRedundant;

    @Column(name = "PO_BOX") // VARCHAR2(255 CHAR)
    private String poBox;

    // TELE2 is duplicated in schema. Assuming one is primary.
    // @Column(name = "TELE2") // VARCHAR2(255 CHAR)
    // private String tele2Redundant;


    @Column(name = "PARENT_ID") // NUMBER(19,0)
    private Long parentId;

    @Column(name = "PARENT_DEPT_ID") // NUMBER(19,0)
    private Long parentDeptId;

    // EMP_ID in HR_DEPARTMENT likely refers to a department head or contact
    @Column(name = "EMP_ID") // VARCHAR2(255 BYTE)
    private String managerEmpId;
}
    