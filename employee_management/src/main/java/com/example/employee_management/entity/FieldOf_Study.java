package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_FIELD_OF_STUDY")
public class FieldOf_Study {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_field_of_study_seq")
    @SequenceGenerator(name = "hr_lu_field_of_study_seq", sequenceName = "HR_LU_FIELD_OF_STUDY_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME")
    private String name;

    // Constructors
    public FieldOf_Study() {}

    public FieldOf_Study(Long id, String name) {
        this.id = id;
        this.name = name;
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
}