package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "HR_EMP_EDUCATION")
@Data
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_emp_education_seq_gen")
    @SequenceGenerator(name = "hr_emp_education_seq_gen", sequenceName = "HR_EMP_EDUCATION_SEQ_GEN",
            // schema = "INSAHR",
            allocationSize = 1)
    @Column(name = "EMP_EDU_ID")
    private Long empEduId;

    @ManyToOne
    @JoinColumn(name = "STUDY_FIELD", referencedColumnName = "ID", insertable = false, updatable = false)
    private FieldOfStudy fieldOfStudy;

    @ManyToOne
    @JoinColumn(name = "EDU_LEVEL_ID", referencedColumnName = "ID", insertable = false, updatable = false)
    private EducationLevel educationLevel;

    @Column(name = "STUDY_FIELD")
    private Long studyField;

    @Column(name = "EMP_ID", length = 255)
    private String empId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", insertable = false, updatable = false)
    @JsonIgnore
    private HrEmployee employee;

    @Column(name = "LOCATION", length = 100)
    private String location;

    @Column(name = "INSTITUTION", length = 100)
    private String institution;

    @Column(name = "PAYMENT_PAYE_BY", length = 50)
    private String paymentPayedBy;

    @Column(name = "EDU_RESULT")
    private Float eduResult;

    @Column(name = "EDU_LEVEL_ID")
    private Long eduLevelId;

    @Column(name = "EDU_CAT", length = 50)
    private String eduCat;

    @Column(name = "START_DATE", length = 10)
    private String startDate;

    @Column(name = "END_DATE", length = 255)
    private String endDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "END_DATE_GC")
    private Date endDateGc;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.empId = employee.getEmpId();
        } else {
            this.empId = null;
        }
    }
}