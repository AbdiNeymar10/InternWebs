package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HR_LU_INSTITUTION")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INSTITUTION_ID", nullable = false, precision = 10, scale = 0)
    private Long institutionId;

    @Column(name = "ACCREDITED", precision = 10, scale = 0)
    private Integer accredited;

    @Column(name = "ADDRESS_ID", length = 255)
    private String addressId;

    @Column(name = "CONTACT_PERSON", length = 255)
    private String contactPerson;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @Column(name = "EMAIL_ADDRESS", length = 255)
    private String emailAddress;

    @Column(name = "FAX_NUMBER", length = 255)
    private String faxNumber;

    @Column(name = "INSTITUTION_NAME", length = 255)
    private String institutionName;

    @Column(name = "PHONE_NUMBER", length = 255)
    private String phoneNumber;

    @Column(name = "TIN_NUMBER", length = 255)
    private String tinNumber;

    @Column(name = "WEB_SITE", length = 255)
    private String webSite;

    @Column(name = "DRAW_ADDRESS", length = 255)
    private String drawAddress;
}