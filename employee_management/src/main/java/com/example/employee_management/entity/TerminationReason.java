package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HR_LU_TERMINATIONREASON")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TerminationReason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TERMINATIONREASON_ID", nullable = false, precision = 10, scale = 0)
    private Long terminationReasonId;

    @Column(name = "REASON", length = 255, nullable = false)
    private String reason;

    @Column(name = "REASONDISCRITION", length = 200)
    private String reasonDiscrition;

    @Column(name = "REASONDISCRIPTION", length = 255)
    private String reasonDiscription;
}