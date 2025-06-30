package com.example.employee_management.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Date;

@Data
public class TrainingDTO {
    private Long id;
    // Removed employeeId validation since it comes from path
    private String employeeId;

    @NotBlank(message = "Institution is required")
    private String institution;

    @NotNull(message = "Payment is required")
    @Positive(message = "Payment must be positive")
    private Double payment;

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Ethiopian start date is required")
    private String startDateEC;

    @NotBlank(message = "Ethiopian end date is required")
    private String endDateEC;

    @NotNull(message = "Gregorian start date is required")
    private Date startDateGC;

    @NotNull(message = "Gregorian end date is required")
    private Date endDateGC;

    @NotBlank(message = "Location is required")
    private String location;
}