package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "HR_LU_VACANCY_TYPES")
public class VacancyType {

    @Id
    @Column(name = "VACANCY_TYPE_ID")
    private Long vacancyTypeId;

    @Column(name = "VACANCY_TYPE", length = 255)
    private String vacancyType;

    // Constructors
    public VacancyType() {
    }

    public VacancyType(Long vacancyTypeId, String vacancyType) {
        this.vacancyTypeId = vacancyTypeId;
        this.vacancyType = vacancyType;
    }

    // Getters and Setters
    public Long getVacancyTypeId() {
        return vacancyTypeId;
    }

    public void setVacancyTypeId(Long vacancyTypeId) {
        this.vacancyTypeId = vacancyTypeId;
    }

    public String getVacancyType() {
        return vacancyType;
    }

    public void setVacancyType(String vacancyType) {
        this.vacancyType = vacancyType;
    }
}