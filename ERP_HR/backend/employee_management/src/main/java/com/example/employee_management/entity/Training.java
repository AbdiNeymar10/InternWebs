package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "HR_EMP_TRAINING")
public class Training {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "training_seq")
    @SequenceGenerator(name = "training_seq", sequenceName = "HR_EMP_TRAINING_SEQ", allocationSize = 1)
    @Column(name = "EMP_TRAINING_ID", nullable = false)
    private Long id;

    @Column(name = "EMP_ID", nullable = false, insertable = false, updatable = false)
    private String employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID")
    @JsonIgnore
    private HrEmployee employee;

    @Column(name = "INSTITUTION", nullable = false)
    private String institution;

    @Column(name = "PAYMENT_FOR_TRAINING")
    private BigDecimal paymentForTraining;

    @Column(name = "TRAININGORCOURSE_NAME", nullable = false)
    private String courseName;

    @Column(name = "START_DATE", nullable = false)
    private String startDateEC;

    @Column(name = "END_DATE", nullable = false)
    private String endDateEC;

    @Column(name = "START_DATE_GC", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date startDateGC;

    @Column(name = "END_DATE_GC", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date endDateGC;

    @Column(name = "LOCATION", nullable = false)
    private String location;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.employeeId = employee.getEmpId();
        } else {
            this.employeeId = null;
        }
    }
}