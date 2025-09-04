package com.example.employee_management.service.impl;

import com.example.employee_management.entity.NotificationTwo;
import com.example.employee_management.repository.NotificationTwoRepository;
import com.example.employee_management.service.NotificationTwoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationTwoServiceImpl implements NotificationTwoService {

    private final NotificationTwoRepository repository;

    @Autowired
    public NotificationTwoServiceImpl(NotificationTwoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public List<NotificationTwo> findByEmployeeId(String employeeId) {
        if (employeeId == null || employeeId.trim().isEmpty()) {
            throw new IllegalArgumentException("Employee ID cannot be null or empty");
        }
        return repository.findByEmployeeId(employeeId);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Notification ID cannot be null");
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public NotificationTwo save(NotificationTwo notification) {
        if (notification == null || notification.getEmployeeId() == null || notification.getMessage() == null) {
            throw new IllegalArgumentException("Notification, employee ID, and message cannot be null");
        }
        return repository.save(notification);
    }

    // Optional: Method to clean up old notifications
    @Transactional
    public void deleteOldNotifications(LocalDateTime threshold) {
        repository.deleteByCreatedAtBefore(threshold);
    }
}