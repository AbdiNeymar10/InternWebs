package com.example.employee_management.repository;

import com.example.employee_management.entity.NotificationTwo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationTwoRepository extends JpaRepository<NotificationTwo, Long> {
    List<NotificationTwo> findByEmployeeId(String employeeId);
    void deleteByCreatedAtBefore(LocalDateTime date);
}