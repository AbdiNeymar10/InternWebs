// src/main/java/com/example/employee_management/dto/PayGradeStepDto.java
package com.example.employee_management.dto;

public class PayGradeStepDto {
    private String salary;
    private String stepNo;

    public PayGradeStepDto(String salary, String stepNo) {
        this.salary = salary;
        this.stepNo = stepNo;
    }

    public String getSalary() {
        return salary;
    }

    public String getStepNo() {
        return stepNo;
    }
}