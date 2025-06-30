package com.example.employee_management.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "HR_JOB_QUALIFICATION")
public class HRJobQualification {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_job_qualification_seq")
    @SequenceGenerator(name = "hr_job_qualification_seq", sequenceName = "HR_JOB_QUALIFICATION_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "JOB_TYPE_ID", referencedColumnName = "ID")
    private HRJob_Type jobType;

    @Column(name = "KEY_COMPTENCY", length = 4000)
    private String keyCompetency;

    @Column(name = "KNOWLEDGE", length = 4000)
    private String knowledge;

    @ManyToOne
    @JoinColumn(name = "LU_EDU_LVL_ID", referencedColumnName = "ID")
    private Education_Level educationLevel;

    @ManyToOne
    @JoinColumn(name = "LU_FIELD_OF_STUDY_ID", referencedColumnName = "ID")
    private FieldOf_Study fieldOfStudy;

    @Column(name = "MIN_EXPERIENCE")
    private Integer minExperience;

    @Column(name = "QUALIFICATION", length = 255)
    private String qualification;

    @Column(name = "SKILL", length = 4000)
    private String skill;

    // Constructors
    public HRJobQualification() {}

    public HRJobQualification(Long id, HRJob_Type jobType, String keyCompetency, String knowledge, Education_Level educationLevel, FieldOf_Study fieldOfStudy, Integer minExperience, String qualification, String skill) {
        this.id = id;
        this.jobType = jobType;
        this.keyCompetency = keyCompetency;
        this.knowledge = knowledge;
        this.educationLevel = educationLevel;
        this.fieldOfStudy = fieldOfStudy;
        this.minExperience = minExperience;
        this.qualification = qualification;
        this.skill = skill;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HRJob_Type getJobType() {
        return jobType;
    }

    public void setJobType(HRJob_Type jobType) {
        this.jobType = jobType;
    }

    public String getKeyCompetency() {
        return keyCompetency;
    }

    public void setKeyCompetency(String keyCompetency) {
        this.keyCompetency = keyCompetency;
    }

    public String getKnowledge() {
        return knowledge;
    }

    public void setKnowledge(String knowledge) {
        this.knowledge = knowledge;
    }

    public Education_Level getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(Education_Level educationLevel) {
        this.educationLevel = educationLevel;
    }

    @Transient
    private List<String> fieldsOfStudy;

    public List<String> getFieldsOfStudy() {
    return fieldsOfStudy;
}

    public void setFieldsOfStudy(List<String> fieldsOfStudy) {
    this.fieldsOfStudy = fieldsOfStudy;
}

    public Integer getMinExperience() {
        return minExperience;
    }

    public void setMinExperience(Integer minExperience) {
        this.minExperience = minExperience;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }
}