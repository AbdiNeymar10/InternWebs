package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HR_LU_LEAVE_TYPES")
@Data
public class HrLuLeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_leave_type_seq")
    @SequenceGenerator(name = "hr_leave_type_seq", sequenceName = "HR_LEAVE_TYPE_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "LEAVE_NAME", length = 20)
    private String leaveName;

    @Column(name = "LEAVE_CODE", length = 20)
    private String leaveCode;

    @Column(name = "DESCRIPTION", length = 20)
    private String description;

    @Column(name = "STATUS", length = 20)
    private String status;
}