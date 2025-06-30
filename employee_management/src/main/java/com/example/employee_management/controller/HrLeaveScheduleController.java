package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLeaveSchedule;
import com.example.employee_management.entity.HrLeaveScheduleDet;
import com.example.employee_management.service.HrLeaveScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-schedules")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from Next.js frontend
public class HrLeaveScheduleController {

    private final HrLeaveScheduleService service;

    @Autowired
    public HrLeaveScheduleController(HrLeaveScheduleService service) {
        this.service = service;
    }

    @GetMapping
    public List<HrLeaveSchedule> getAllLeaveSchedules() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLeaveSchedule> getLeaveScheduleById(@PathVariable Long id) {
        Optional<HrLeaveSchedule> schedule = service.findById(id);
        return schedule.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/details")
    public List<HrLeaveScheduleDet> getScheduleDetails(@PathVariable Long id) {
        return service.findById(id)
                .map(HrLeaveSchedule::getScheduleDetails)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    @PostMapping
    public HrLeaveSchedule createLeaveSchedule(@RequestBody HrLeaveSchedule schedule) {
        return service.save(schedule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLeaveSchedule> updateLeaveSchedule(
            @PathVariable Long id, @RequestBody HrLeaveSchedule schedule) {
        return ResponseEntity.ok(service.update(id, schedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveSchedule(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(params = {"employeeId", "leaveYearId"})
    public List<HrLeaveSchedule> getLeaveSchedulesByEmployeeAndYear(
            @RequestParam String employeeId,
            @RequestParam Long leaveYearId) {
        return service.findByEmployeeIdAndYear(employeeId, leaveYearId);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<HrLeaveSchedule> updateLeaveScheduleStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus(), request.getRemark()));
    }

    public static class StatusUpdateRequest {
        private String status;
        private String remark;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }
    }
}