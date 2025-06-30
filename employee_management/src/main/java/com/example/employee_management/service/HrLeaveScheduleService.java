package com.example.employee_management.service;

import com.example.employee_management.entity.HrLeaveSchedule;
import com.example.employee_management.repository.HrLeaveScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HrLeaveScheduleService {

    private final HrLeaveScheduleRepository repository;

    @Autowired
    public HrLeaveScheduleService(HrLeaveScheduleRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<HrLeaveSchedule> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<HrLeaveSchedule> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public HrLeaveSchedule save(HrLeaveSchedule schedule) {
        if (schedule.getScheduleDetails() != null) {
            schedule.getScheduleDetails().forEach(detail -> detail.setHrLeaveSchedule(schedule));
        }
        return repository.save(schedule);
    }

    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public HrLeaveSchedule update(Long id, HrLeaveSchedule updatedSchedule) {
        return repository.findById(id)
                .map(schedule -> {
                    schedule.setLeaveYearId(updatedSchedule.getLeaveYearId());
                    schedule.setEmployeeId(updatedSchedule.getEmployeeId());
                    schedule.setStatus(updatedSchedule.getStatus());
                    schedule.setDescription(updatedSchedule.getDescription());

                    // Update details if provided
                    if (updatedSchedule.getScheduleDetails() != null) {
                        schedule.getScheduleDetails().clear();
                        schedule.getScheduleDetails().addAll(updatedSchedule.getScheduleDetails());
                        schedule.getScheduleDetails().forEach(detail -> detail.setHrLeaveSchedule(schedule));
                    }

                    return repository.save(schedule);
                })
                .orElseGet(() -> {
                    updatedSchedule.setId(id);
                    return this.save(updatedSchedule);
                });
    }

    @Transactional(readOnly = true)
    public List<HrLeaveSchedule> findByEmployeeIdAndYear(String employeeId, Long leaveYearId) {
        return repository.findByEmployeeIdAndLeaveYearId(employeeId, leaveYearId);
    }

    @Transactional
    public HrLeaveSchedule updateStatus(Long id, String status, String remark) {
        return repository.findById(id)
                .map(schedule -> {
                    schedule.setStatus(status);
                    if (remark != null && !remark.isEmpty()) {
                        schedule.setDescription(remark);
                    }
                    return repository.save(schedule);
                })
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
    }
}