package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLeaveScheduleDet;
import com.example.employee_management.service.HrLeaveScheduleDetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-schedule-details")
@CrossOrigin(origins = "http://localhost:3000")
public class HrLeaveScheduleDetController {

    private final HrLeaveScheduleDetService service;

    @Autowired
    public HrLeaveScheduleDetController(HrLeaveScheduleDetService service) {
        this.service = service;
    }

    @GetMapping
    public List<HrLeaveScheduleDet> getAllLeaveScheduleDetails() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLeaveScheduleDet> getLeaveScheduleDetailById(@PathVariable Long id) {
        Optional<HrLeaveScheduleDet> detail = service.findById(id);
        return detail.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-schedule/{scheduleId}")
    public List<HrLeaveScheduleDet> getDetailsByScheduleId(@PathVariable Long scheduleId) {
        return service.findByScheduleId(scheduleId);
    }

    @PostMapping
    public HrLeaveScheduleDet createLeaveScheduleDetail(@RequestBody HrLeaveScheduleDet detail) {
        return service.save(detail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLeaveScheduleDet> updateLeaveScheduleDetail(
            @PathVariable Long id, @RequestBody HrLeaveScheduleDet detail) {
        return ResponseEntity.ok(service.update(id, detail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveScheduleDetail(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}