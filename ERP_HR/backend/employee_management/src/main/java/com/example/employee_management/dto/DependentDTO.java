package com.example.employee_management.dto;

import lombok.Data;
import java.util.Date;

@Data
public class DependentDTO {
    private String dependentsId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String relationship;
    private String status;
    private String sex;
    private String emergencyContact;
    private String dateOfBirth;
    private Date birthDateGc;
    private String empId;
}