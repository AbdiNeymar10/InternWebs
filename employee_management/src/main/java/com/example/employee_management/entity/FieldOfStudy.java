package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HR_LU_FIELD_OF_STUDY")
@Data
@NoArgsConstructor // Added
@AllArgsConstructor // Added
public class FieldOfStudy {

    @Id
    // Add this annotation for automatic ID generation.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- Added this line
    @Column(name = "ID", nullable = false) // Make sure this matches your database column name
    private Long id;

    @Column(name = "NAME", length = 255) // Make sure this matches your database column name
    private String name;

    // Lombok handles the rest
}