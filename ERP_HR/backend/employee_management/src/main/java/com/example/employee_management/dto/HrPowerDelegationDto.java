package com.example.employee_management.dto;

import lombok.Data;

import java.util.Date;

@Data
public class HrPowerDelegationDto {
    private String delegatorId;
    private String delegatorName;
    private String delegateeId;
    private String delegateeName;
    private String department;
    private String position;
    private Date fromDate;
    private String toDate;
    private String requestDate;
    private String reason;
    private String user;
}