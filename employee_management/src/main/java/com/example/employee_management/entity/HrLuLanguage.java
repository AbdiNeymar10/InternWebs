package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_LANGUAGE")
public class HrLuLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = false, precision = 10)
    private Long id;

    @Column(name = "LANGUAGE_NAME", length = 30)
    private String languageName;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    // Constructors
    public HrLuLanguage() {
    }

    public HrLuLanguage(String languageName, String description) {
        this.languageName = languageName;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLanguageName() {
        return languageName;
    }

    public void setLanguageName(String languageName) {
        this.languageName = languageName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // toString
    @Override
    public String toString() {
        return "HrLuLanguage{" +
                "id=" + id +
                ", languageName='" + languageName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
