package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "HR_NOTIFICATIONTWO")
@Data
@NoArgsConstructor
public class NotificationTwo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_notificationtwo_seq_gen")
    @SequenceGenerator(name = "hr_notificationtwo_seq_gen", sequenceName = "HR_NOTIFICATIONTWO_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "EMPLOYEE_ID", nullable = false, length = 20)
    private String employeeId;

    @Column(name = "MESSAGE", nullable = false, length = 255)
    private String message;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    public NotificationTwo(String employeeId, String message) {
        this.employeeId = employeeId;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }
}