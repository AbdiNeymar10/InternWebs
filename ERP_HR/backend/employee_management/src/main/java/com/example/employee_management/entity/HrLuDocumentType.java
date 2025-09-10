package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_DOCUMENT_TYPE")
public class HrLuDocumentType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_document_type_seq")
    @SequenceGenerator(name = "hr_lu_document_type_seq", sequenceName = "hr_lu_document_type_seq", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "IS_ACTIVE")
    private String isActive;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIsActive() { return isActive; }
    public void setIsActive(String isActive) { this.isActive = isActive; }
}