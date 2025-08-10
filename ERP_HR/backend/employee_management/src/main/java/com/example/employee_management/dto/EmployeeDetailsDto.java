package com.example.employee_management.dto;

// import java.util.Objects;

public class EmployeeDetailsDto {
    // private String empId;
    // private String firstName;
    // private String middleName;
    // private String lastName;
    // private String efirstName;
    // private String emiddleName;
    // private String elastName;
//    private PositionDetailDto position;
    // private DepartmentDto department;
    // private Object status;
    // private String gender;
    // private String dateOfBirth;
    // private NationalityDto nationality;

    // Add getters and setters for all fields

    // Existing nested DTO classes (PositionDetailDto, DepartmentDto)

    // Add NationalityDto
    public static class NationalityDto {
        private String nationalityId;
        private String nationalityName;

        // Getters and setters
        public String getNationalityId() { return nationalityId; }
        public void setNationalityId(String nationalityId) { this.nationalityId = nationalityId; }
        public String getNationalityName() { return nationalityName; }
        public void setNationalityName(String nationalityName) { this.nationalityName = nationalityName; }
    }
}