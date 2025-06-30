// SalaryStepDto.java
package com.example.employee_management.dto;

import java.math.BigDecimal;

public class SalaryStepDto {
    private Integer stepNo;
    private String salary;

    public SalaryStepDto(Integer stepNo, String salary) {
        this.stepNo = stepNo;
        this.salary = salary;
    }

    // Getters and setters
    public Integer getStepNo() {
        return stepNo;
    }

    public void setStepNo(Integer stepNo) {
        this.stepNo = stepNo;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = String.valueOf(salary);
    }
}