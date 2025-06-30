package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HR_LEAVE_SETTING")
@Data
public class HrLeaveSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_emp_language_seq_gen")
    @SequenceGenerator(name = "hr_emp_language_seq_gen", sequenceName = "HR_EMP_LANGUAGE_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "DESCRIPTION", length = 100)
    private String description;

    @Column(name = "GENDER", length = 20)
    private String gender;

    @Column(name = "LEAVE_TYPE_CODE", length = 20)
    private String leaveTypeCode;

    @Column(name = "MAX_NUM_OF_DAYS")
    private Integer maxNumOfDays;

    @Column(name = "MIN_NUM_OF_DAYS")
    private Integer minNumOfDays;

    @Column(name = "PAYMENT_CODE", length = 20)
    private String paymentCode;

    @Column(name = "EMPLOYEMENT_TYPE", length = 20)
    private String employmentType;

    @ManyToOne
    @JoinColumn(name = "LEAVE_TYPE_ID", referencedColumnName = "ID")
    private HrLuLeaveType leaveType;

    @Column(name = "STATUS", length = 20)
    private String status;

    @Column(name = "TO_BALANCE")
    private Integer toBalance;

    @Column(name = "INCLUDE_SAT")
    private Integer includeSat;

    @Column(name = "INCLUDE_SUN")
    private Integer includeSun;

    @Column(name = "INCLUDE_HOLLYDAY")
    private Integer includeHoliday;
}