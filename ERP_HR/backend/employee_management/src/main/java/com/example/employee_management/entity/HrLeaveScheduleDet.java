package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HR_LEAVE_SCHEDULE_DET")
@Data
@NoArgsConstructor
public class HrLeaveScheduleDet {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_leave_schedule_det_seq_gen")
    @SequenceGenerator(name = "hr_leave_schedule_det_seq_gen", sequenceName = "HR_LEAVE_SCHEDULE_DET_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "LEAVE_MONTH", length = 20)
    private String leaveMonth;

    @Column(name = "DESCRIPTION", length = 200)
    private String description;

    @Column(name = "PRIORITY", precision = 7)
    private Long priority;

    @Column(name = "STATUS", length = 25, columnDefinition = "VARCHAR2(25) DEFAULT 'Pending'")
    private String status;

    @Column(name = "NO_DAYS", length = 20)
    private String noDays;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SCHEDULE_ID", referencedColumnName = "ID")
    @JsonIgnore
    private HrLeaveSchedule hrLeaveSchedule;

    public Long getScheduleId() {
        return hrLeaveSchedule != null ? hrLeaveSchedule.getId() : null;
    }

    public void setScheduleId(Long scheduleId) {
        if (hrLeaveSchedule == null) {
            hrLeaveSchedule = new HrLeaveSchedule();
        }
        hrLeaveSchedule.setId(scheduleId);
    }
}