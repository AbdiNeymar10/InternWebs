package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HR_EXPERIENCE")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_experience_seq_gen")
    @SequenceGenerator(name = "hr_experience_seq_gen", sequenceName = "HR_EXPERIENCE_SEQ", allocationSize = 1)
    @Column(name = "ID", updatable = false, nullable = false)
    private Long id;

    @Column(name = "EMP_ID", length = 255)
    private String employeeId; // Stores EMP_ID from HR_EMPLOYEES

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID", insertable = false, updatable = false)
    @JsonIgnore
    private HrEmployee employee;

    @Column(name = "JOB_TITLE")
    private String jobTitle;

    @Column(name = "JOB_TITLE_INAMHARIC")
    private String jobTitleInAmharic;

    @Column(name = "REF_NO")
    private String refNo;

    @Column(name = "RECORDED_DATE")
    private String startDateEC;

    @Column(name = "FROM_DATE")
    private String endDateEC;

    @Column(name = "DATE_GC")
    private String startDateGC;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.employeeId = employee.getEmpId();
        } else {
            this.employeeId = null;
        }
    }
}