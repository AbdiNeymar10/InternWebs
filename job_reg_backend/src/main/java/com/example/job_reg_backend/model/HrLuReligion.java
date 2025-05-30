package com.example.job_reg_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_RELIGION")
public class HrLuReligion {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME", length = 255)
    private String name;

    @Column(name = "DESCRIPTION", length = 20)
    private String description;

    // Constructors
    public HrLuReligion() {
    }

    public HrLuReligion(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // toString() for logging/debugging
    @Override
    public String toString() {
        return "HrLuReligion{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}