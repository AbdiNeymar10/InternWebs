package com.example.employee_management.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String employeeId;
    private Integer addressType;
    private String wereda;
    private String kebele;
    private String telephoneOffice;
    private String email;
    private String poBox;
    private String mobileNumber;
    private String zone;
    private String kifleketema;
    private String teleHome;
    private String houseNo;
    private String region;

    // Region details
    private Long regionId;
    private String regionName;
    private String regionDescription;
}