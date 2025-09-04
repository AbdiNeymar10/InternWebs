package com.example.employee_management.service;

import com.example.employee_management.entity.NotificationTwo;
import java.util.List;

public interface NotificationTwoService {
    List<NotificationTwo> findByEmployeeId(String employeeId);
    void deleteById(Long id);
    NotificationTwo save(NotificationTwo notification);
}