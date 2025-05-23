package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_FIELD_OF_STUDY")
public class HRFieldOfStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_field_of_study_seq")
    @SequenceGenerator(name = "hr_field_of_study_seq", sequenceName = "HR_FIELD_OF_STUDY_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "LU_FIELD_OF_STUDY_ID", referencedColumnName = "ID")
    private FieldOfStudy fieldOfStudy;

    @ManyToOne
    @JoinColumn(name = "JOB_QUALIFICATION_ID", referencedColumnName = "ID")
    private HRJobQualification jobQualification;

    // Constructors
    public HRFieldOfStudy() {}

    public HRFieldOfStudy(Long id, FieldOfStudy fieldOfStudy, HRJobQualification jobQualification) {
        this.id = id;
        this.fieldOfStudy = fieldOfStudy;
        this.jobQualification = jobQualification;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FieldOfStudy getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(FieldOfStudy fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public HRJobQualification getJobQualification() {
        return jobQualification;
    }

    public void setJobQualification(HRJobQualification jobQualification) {
        this.jobQualification = jobQualification;
    }
}