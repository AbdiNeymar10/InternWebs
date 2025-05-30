package com.example.job_reg_backend.model;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.sql.Blob;

@Entity
@Table(name = "HR_EMPLOYEES")
@Data
public class HrEmployee {

    @Id
    @Column(name = "EMP_ID", nullable = false, length = 255)
    private String empId;

    @Column(name = "DATE_OF_BIRTH", length = 50) // Keep or adjust length
    private String dateOfBirth;

    @Column(name = "DEPT_JOB_CODE", precision = 10)
    private BigDecimal deptJobCode;

    @Column(name = "EMP_STATUS", precision = 10)
    private BigDecimal empStatus;

    @ManyToOne
    @JoinColumn(name = "EMPLOYMENT_TYPE", referencedColumnName = "ID")
    private HrLuEmploymentType employmentType;

    @Column(name = "FIRST_NAME", length = 255)
    private String firstName;

    @Column(name = "HIRE_DATE", length = 50) // Keep or adjust length as needed
    private String hireDate;

    @Column(name = "LAST_NAME", length = 255)
    private String lastName;

    @Column(name = "MARITAL_STATUS", length = 255)
    private String maritalStatus;

    @Column(name = "MIDDLE_NAME", length = 255)
    private String middleName;

    @Column(name = "PHOTO")
    private Blob photo;

    @Column(name = "RETIREMENT_NO", length = 255)
    private String retirementNo;

    @Column(name = "SALARY", length = 500)
    // Keep or adjust length as needed
    @JsonSetter(nulls = Nulls.SKIP)
    private String salary;

    @Column(name = "SEX", length = 255)
    private String sex;

    @ManyToOne
    @JoinColumn(name = "DEPT_ID", referencedColumnName = "DEPT_ID")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "NATION_CODE", referencedColumnName = "NATION_CODE")
    private HrLuNation nation;

    @ManyToOne
    @JoinColumn(name = "NATIONALITYID", referencedColumnName = "NATIONALITYID")
    private HrLuNationality nationality;

    @ManyToOne
    @JoinColumn(name = "PAY_GRADE_ID", referencedColumnName = "PAY_GRADE_ID")
    private HRPayGrad payGrade;

    @Column(name = "RANKID", precision = 10)
    private BigDecimal rankId;

    @ManyToOne
    @JoinColumn(name = "TITLEID", referencedColumnName = "TITLEID")
    private HrLuTitle title;

    @Column(name = "TIN_NUMER", length = 255)
    private String tinNumer;

    @Column(name = "PENSION_NUMBER", length = 255)
    private String pensionNumber;

    @ManyToOne
    @JoinColumn(name = "RELIGION_ID", referencedColumnName = "ID")
    private HrLuReligion religion;

    @Column(name = "LABOUR_UNION", precision = 7)
    private BigDecimal labourUnion;

    @Column(name = "CONTRACT_END", length = 200)
    private String contractEnd;

    @Column(name = "FILE_NAME", length = 255)
    private String fileName;

    @Column(name = "DISCIPLINE_PENALITY", precision = 7)
    private BigDecimal disciplinePenality;

    @Column(name = "HIRED_DATE", length = 20)
    private String hiredDate;

    @Column(name = "BIRTH_DATE", length = 20) // Keep or adjust length as needed
    private String birthDate;

    @Column(name = "END_OF_CONTRACT", length = 20)
    private String endOfContract;

    @ManyToOne
    @JoinColumn(name = "RECRUITMENT_TYPE", referencedColumnName = "RECRUITMENT_TYPE")
    private HrLuRecruitmentType recruitmentType;

    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "JOB_RESPONSIBILITY", referencedColumnName = "ID")
    private HrLuResponsibility jobResponsibility;

    @ManyToOne
    @JoinColumn(name = "JOB_CODE", referencedColumnName = "ID")
    private HRJobTypeDetail jobTypeDetail;

    @ManyToOne
    @JoinColumn(name = "POSITION_NAME", referencedColumnName = "ID")
    private HrLuPositionName position;

    @Column(name = "POSITION_STATUS", length = 20)
    private String positionStatus;
    @Column(name = "ACCOUNT_NO", length = 20) // adjust length as needed
    private String accountNo;
    @Column(name = "TERMINATION_DATE", length = 100)
    private String terminationDate;

    @Column(name = "RE_ACTIVE_DESCRIPTION", length = 4000)
    private String reActiveDescription;

    @Column(name = "RE_ACTIVE_DATE", length = 200)
    private String reActiveDate;

    @Column(name = "OMNISSION_STATUS")
    private BigDecimal omnissionStatus;

    @Column(name = "DRIVER_TYPE", length = 20)
    private String driverType;

    @ManyToOne
    @JoinColumn(name = "BRANCH", referencedColumnName = "ID")
    private HrLuBranch branch;

    @Column(name = "TESS", length = 20)
    private String tess;

    @Column(name = "DEDACTION_DESCRIPTIVE", length = 400)
    private String dedactionDescriptive;

    @Column(name = "FULL_NAME_ENG_WORD", length = 4000)
    private String fullNameEngWord;

    @Column(name = "EFIRST_NAME", length = 255)
    private String efirstName;

    @Column(name = "EMIDDLE_NAME", length = 255)
    private String emiddleName;

    @Column(name = "ELAST_NAME", length = 255)
    private String elastName;

    @Column(name = "PERMANENT_DATE", length = 20)
    private String permanentDate;

    @Column(name = "EPID")
    private BigDecimal epid;

    @ManyToOne
    @JoinColumn(name = "JOB_FAMILY", referencedColumnName = "ID")
    private JobFamily jobFamily;

    @ManyToOne
    @JoinColumn(name = "ICF", referencedColumnName = "ID")
    private HRLuIcf icf;


}