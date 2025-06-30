package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Blob;

@Entity
@Table(name = "HR_EMPLOYEES")
@Getter
@Setter
public class Employee {

    @Id
    @Column(name = "EMP_ID", nullable = false)
    private String empId;

    @Column(name = "DATE_OF_BIRTH") // VARCHAR2(50 CHAR)
    private String dateOfBirth;

    @Column(name = "DEPT_JOB_CODE") // NUMBER(10,0)
    private Long deptJobCode;

    @Column(name = "EMP_STATUS") // NUMBER(10,0)
    private Long empStatus;

    @Column(name = "FIRST_NAME") // VARCHAR2(255 BYTE)
    private String firstName;

    @Column(name = "HIRE_DATE") // VARCHAR2(50 CHAR)
    private String hireDate;

    @Column(name = "LAST_NAME") // VARCHAR2(255 BYTE)
    private String lastName;

    @Column(name = "MARITAL_STATUS") // VARCHAR2(255 BYTE)
    private String maritalStatus;

    @Column(name = "MIDDLE_NAME") // VARCHAR2(255 BYTE)
    private String middleName;

    @Column(name = "PHOTO")
    @Lob
//    @JsonIgnore
    private Blob photo;

    @Column(name = "RETIREMENT_NO") // VARCHAR2(255 BYTE)
    private String retirementNo;

    @Column(name = "SALARY") // VARCHAR2(500 CHAR)
    private String salary;

    @Column(name = "SEX") // VARCHAR2(255 BYTE)
    private String gender; // Renamed from SEX for clarity in Java

    @Column(name = "DEPT_ID") // NUMBER(38,2)
    private BigDecimal departmentId; // Using BigDecimal for precision

    @Column(name = "JOB_CODE") // NUMBER(10,0) - This was the key for job title
    private Long jobCode;

    @Column(name = "NATION_CODE") // NUMBER(10,0)
    private Long nationCode;

    @Column(name = "NATIONALITYID") // NUMBER(10,0)
    private Long nationalityId;

    @Column(name = "PAY_GRADE_ID") // NUMBER(10,0)
    private Long payGradeId;

    @Column(name = "RANKID") // NUMBER(10,0)
    private Long rankId;

    @Column(name = "TITLEID") // NUMBER(10,0)
    private Long titleId;

    @Column(name = "TIN_NUMER") // VARCHAR2(255 BYTE) - Note: Typo in DB schema "NUMER"
    private String tinNumberOld; // Named to avoid conflict with TIN_NUMBER

    @Column(name = "PENSION_NUMBER") // VARCHAR2(255 BYTE)
    private String pensionNumber;

    @Column(name = "RELIGION_ID") // NUMBER(38,0)
    private Long religionId;

    @Column(name = "LABOUR_UNION") // NUMBER(7,0)
    private Integer labourUnion;

    @Column(name = "CONTRACT_END") // VARCHAR2(200 CHAR)
    private String contractEnd;

    @Column(name = "FILE_NAME") // VARCHAR2(255 CHAR)
    private String fileName;

    @Column(name = "DISCIPLINE_PENALITY") // NUMBER(7,0)
    private Integer disciplinePenality;

    @Column(name = "HIRED_DATE") // VARCHAR2(20 CHAR) - Duplicate name, careful with mapping if both are used
    private String hiredDateShort; // Renamed to avoid conflict if the other HIRE_DATE is primary

    @Column(name = "BIRTH_DATE") // VARCHAR2(20 CHAR)
    private String birthDate;

    @Column(name = "END_OF_CONTRACT") // VARCHAR2(20 CHAR)
    private String endOfContract;

    @Column(name = "RECRUITMENT_TYPE") // VARCHAR2(45 CHAR)
    private String recruitmentType;

    @Column(name = "ID") // NUMBER - Assuming this is a different ID, not the PK
    private Long secondaryId; // Renamed to avoid conflict with empId if it's not the PK

    @Column(name = "JOB_RESPONSIBILITY") // NUMBER
    private Long jobResponsibility;

    @Column(name = "SALARYTEST") // VARCHAR2(255 CHAR)
    private String salaryTest;

    @Column(name = "PENSION_EXCLUDE") // NUMBER
    private Long pensionExclude;

    @Column(name = "ACCOUNT_NO") // VARCHAR2(20 CHAR)
    private String accountNo;

    @Column(name = "POSITION_NAME") // NUMBER
    private Long positionName; // Likely an ID to another table

    @Column(name = "POSTION_STATUS") // VARCHAR2(255 CHAR) - Note: Typo in DB "POSTION"
    private String positionStatusOld; // Renamed due to typo

    @Column(name = "TERMINATION_DATE") // VARCHAR2(100 CHAR)
    private String terminationDate;

    @Column(name = "RE_ACTIVE_DESCRIPTION") // VARCHAR2(4000 CHAR)
    private String reActiveDescription;

    @Column(name = "RE_ACTIVE_DATE") // VARCHAR2(200 CHAR)
    private String reActiveDate;

    @Column(name = "ONMISSION_STATUS") // NUMBER
    private Long onMissionStatus;

    @Column(name = "DRIVER_TYPE") // VARCHAR2(20 CHAR)
    private String driverType;

    @Column(name = "BRANCH") // NUMBER
    private Long branch;

    @Column(name = "TESS") // VARCHAR2(20 CHAR)
    private String tess;

    @Column(name = "DEDACTION_DESCRPTIVE") // VARCHAR2(255 CHAR) - Note: Typo "DEDACTION", "DESCRPTIVE"
    private String dedactionDescrptiveOld;

    @Column(name = "FULL_NAME_ENG_WORD") // VARCHAR2(4000 CHAR)
    private String fullNameEngWord;

    @Column(name = "EFIRST_NAME") // VARCHAR2(255 BYTE)
    private String eFirstName;

    @Column(name = "EMIDDLE_NAME") // VARCHAR2(255 BYTE)
    private String eMiddleName;

    @Column(name = "ELAST_NAME") // VARCHAR2(255 BYTE)
    private String eLastName;

    @Column(name = "PERMANENT_DATE") // VARCHAR2(20 CHAR)
    private String permanentDate;

    @Column(name = "EPID") // NUMBER
    private Long epid;

    @Column(name = "DEDACTION_DESCRIPTIVE") // NVARCHAR2(400 CHAR) - Note: Typo "DEDACTION"
    private String dedactionDescriptive; // Corrected spelling from DB

    @Column(name = "OMNISSION_STATUS") // NUMBER(38,2) - Note: Typo "OMNISSION"
    private BigDecimal omnissionStatus; // Using BigDecimal

    @Column(name = "POSITION_STATUS") // VARCHAR2(20 CHAR)
    private String positionStatus;

    @Column(name = "ICF") // NUMBER(19,0)
    private Long icf;

    @Column(name = "JOB_FAMILY") // NUMBER(10,0)
    private Long jobFamily;

    @Column(name = "EMPLOYMENT_TYPE") // NUMBER(10,0)
    private Integer employmentType; // Used Integer in service, keeping consistent

    @Column(name = "RECRUITMENT_TYPE_NEW") // NUMBER(10,0)
    private Long recruitmentTypeNew;

    @Column(name = "TIN_NUMBER") // VARCHAR2(255 CHAR)
    private String tinNumber;

    @Column(name = "UNUSED_LEAVE_DAYS") // NUMBER(10,0)
    private Integer unusedLeaveDays;



    public String getSex() {
        return "";
    }

    public Object getDeptId() {
        return null;
    }
}