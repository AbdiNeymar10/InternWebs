package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HR_LU_LEAVE_INCIDENT_TYPE")
@Data
public class HrLuIncidentType {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_lu_incident_type_seq_gen")
    @SequenceGenerator(name = "hr_lu_incident_type_seq_gen", sequenceName = "HR_LU_LEAVE_INCIDENT_TYPE_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    @Column(name = "INCIDENT_TYPE", length = 200) // Matches your DB column
    private String incidentType; // Field name to hold the incident type's name

    @Column(name = "DESCRIPTION", length = 200)
    private String description;

    // Constructors, getters, and setters if not using Lombok @Data
}