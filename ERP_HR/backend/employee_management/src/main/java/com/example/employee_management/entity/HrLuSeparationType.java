package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "HR_LU_SEPARATION_TYPE")
public class HrLuSeparationType {
    @Id
    @Column(name = "SEPRATION_TYPE_ID")
    private String separationTypeId;

    @Column(name = "DESRIPTION")
    private String description;

    // Getters and Setters
    public String getSeparationTypeId() {
        return separationTypeId;
    }

    public void setSeparationTypeId(String separationTypeId) {
        this.separationTypeId = separationTypeId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
