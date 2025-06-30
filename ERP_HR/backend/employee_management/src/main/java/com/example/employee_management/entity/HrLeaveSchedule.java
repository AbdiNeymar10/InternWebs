package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "HR_LEAVE_SCHEDULE")
@Data
@NoArgsConstructor
public class HrLeaveSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_leave_schedule_seq_gen")
    @SequenceGenerator(name = "hr_leave_schedule_seq_gen", sequenceName = "HR_LEAVE_SCHEDULE_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "LEAVE_YEAR_ID", nullable = false, precision = 7)
    private Long leaveYearId;

    @Column(name = "EMPLOYEE_ID", nullable = false, length = 20)
    private String employeeId;

    @Column(name = "STATUS", length = 25, columnDefinition = "VARCHAR2(25) DEFAULT 'Pending'")
    private String status;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @OneToMany(mappedBy = "hrLeaveSchedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HrLeaveScheduleDet> scheduleDetails;
}