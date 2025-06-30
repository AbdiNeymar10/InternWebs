package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "HR_LU_REGION")
@Data
public class HrLuRegion {
    @Id
    @Column(name = "ID", columnDefinition = "NUMBER")
    private Long id;

    @Column(name = "REGION_NAME", columnDefinition = "VARCHAR2(200 BYTE)")
    private String regionName;

    @Column(name = "DESCRIPTION", columnDefinition = "VARCHAR2(200 BYTE)")
    private String description;
}