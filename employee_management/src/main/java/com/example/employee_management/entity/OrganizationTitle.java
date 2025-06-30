package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "HR_LU_ORGANIZATION_TITLE")
@Data
public class OrganizationTitle {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME")
    private String name;
}