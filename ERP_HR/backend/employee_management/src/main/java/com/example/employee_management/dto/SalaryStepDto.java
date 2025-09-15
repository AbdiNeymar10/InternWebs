// SalaryStepDto.java
package com.example.employee_management.dto;

import java.math.BigDecimal;

public class SalaryStepDto {
    private Integer stepNo;
    private String salary;
    private Long payGradeId;

    public SalaryStepDto(Integer stepNo, String salary, Long payGradeId) {
        this.stepNo = stepNo;
        this.salary = salary;
        this.payGradeId = payGradeId;
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

    public Long getPayGradeId() {
        return payGradeId;
    }

    public void setPayGradeId(Long payGradeId) {
        this.payGradeId = payGradeId;
    }
}