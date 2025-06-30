package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLeaveSetting;
import com.example.employee_management.service.HrLeaveSettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-leave-settings")
public class HrLeaveSettingController {

    private final HrLeaveSettingService service;

    @Autowired
    public HrLeaveSettingController(HrLeaveSettingService service) {
        this.service = service;
    }

    @GetMapping
    public List<HrLeaveSetting> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLeaveSetting> getById(@PathVariable Long id) {
        Optional<HrLeaveSetting> hrLeaveSetting = service.findById(id);
        return hrLeaveSetting.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-leave-type/{leaveTypeId}")
    public List<HrLeaveSetting> getByLeaveType(@PathVariable Long leaveTypeId) {
        return service.findByLeaveTypeId(leaveTypeId);
    }

    @PostMapping
    public HrLeaveSetting create(@RequestBody HrLeaveSetting hrLeaveSetting) {
        return service.save(hrLeaveSetting);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLeaveSetting> update(@PathVariable Long id, @RequestBody HrLeaveSetting hrLeaveSetting) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        hrLeaveSetting.setId(id);
        return ResponseEntity.ok(service.save(hrLeaveSetting));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}