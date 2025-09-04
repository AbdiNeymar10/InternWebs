package com.example.employee_management.controller;

import com.example.employee_management.entity.NotificationTwo;
import com.example.employee_management.service.NotificationTwoService;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationTwoController {

    private final NotificationTwoService service;

    @Autowired
    public NotificationTwoController(NotificationTwoService service) {
        this.service = service;
    }
    //

    @GetMapping(params = "employeeId")
    public List<NotificationTwo> getNotificationsByEmployeeId(@RequestParam String employeeId) {
        return service.findByEmployeeId(employeeId);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        service.deleteById(id);
    }
}