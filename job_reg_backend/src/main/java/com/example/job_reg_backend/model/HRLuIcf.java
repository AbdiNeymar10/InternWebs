package com.example.job_reg_backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "HR_LU_ICF")
public class HRLuIcf {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_icf_seq")
    @SequenceGenerator(name = "hr_lu_icf_seq", sequenceName = "HR_LU_ICF_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @JsonProperty("description") // Map the JSON field "description" to this field
    @Column(name = "DESCRIPTION")
    private String description;

    @JsonProperty("ICF") // Map the JSON field "ICF" to this field
    @Column(name = "ICF")
    private String icf;

    // Constructors
    public HRLuIcf() {}

    public HRLuIcf(Long id, String description, String icf) {
        this.id = id;
        this.description = description;
        this.icf = icf;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcf() {
        return icf;
    }

    public void setIcf(String icf) {
        this.icf = icf;
    }
}