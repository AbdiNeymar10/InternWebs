package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "HR_LU_ADRESS_TYPE")
@Data
public class HrLuAddressType {
    @Id
    @Column(name = "ID", columnDefinition = "NUMBER")
    private Long id;

    @Column(name = "ADDRES_TYPE", columnDefinition = "VARCHAR2(255 BYTE)")
    private String addressType;

    @Column(name = "DESCRIPTION", columnDefinition = "VARCHAR2(255 BYTE)")
    private String description;
}