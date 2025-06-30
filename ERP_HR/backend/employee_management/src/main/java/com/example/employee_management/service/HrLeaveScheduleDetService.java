package com.example.employee_management.service;

import com.example.employee_management.entity.HrLeaveSchedule;
import com.example.employee_management.entity.HrLeaveScheduleDet;
import com.example.employee_management.repository.HrLeaveScheduleDetRepository;
import com.example.employee_management.repository.HrLeaveScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HrLeaveScheduleDetService {

    private final HrLeaveScheduleDetRepository repository;
    private final HrLeaveScheduleRepository scheduleRepository;

    @Autowired
    public HrLeaveScheduleDetService(HrLeaveScheduleDetRepository repository,
                                     HrLeaveScheduleRepository scheduleRepository) {
        this.repository = repository;
        this.scheduleRepository = scheduleRepository;
    }

    @Transactional(readOnly = true)
    public List<HrLeaveScheduleDet> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<HrLeaveScheduleDet> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public HrLeaveScheduleDet save(HrLeaveScheduleDet scheduleDetail) {
        if (scheduleDetail.getHrLeaveSchedule() == null && scheduleDetail.getScheduleId() != null) {
            HrLeaveSchedule schedule = scheduleRepository.findById(scheduleDetail.getScheduleId())
                    .orElseThrow(() -> new RuntimeException("Parent schedule not found"));
            scheduleDetail.setHrLeaveSchedule(schedule);
        }
        return repository.save(scheduleDetail);
    }

    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public HrLeaveScheduleDet update(Long id, HrLeaveScheduleDet updatedDetail) {
        return repository.findById(id)
                .map(detail -> {
                    detail.setLeaveMonth(updatedDetail.getLeaveMonth());
                    detail.setDescription(updatedDetail.getDescription());
                    detail.setPriority(updatedDetail.getPriority());
                    detail.setNoDays(updatedDetail.getNoDays());

                    // Update parent relationship if needed
                    if (updatedDetail.getScheduleId() != null &&
                            (detail.getHrLeaveSchedule() == null ||
                                    !updatedDetail.getScheduleId().equals(detail.getHrLeaveSchedule().getId()))) {
                        HrLeaveSchedule schedule = scheduleRepository.findById(updatedDetail.getScheduleId())
                                .orElseThrow(() -> new RuntimeException("Parent schedule not found"));
                        detail.setHrLeaveSchedule(schedule);
                    }

                    return repository.save(detail);
                })
                .orElseGet(() -> {
                    updatedDetail.setId(id);
                    return this.save(updatedDetail);
                });
    }

    @Transactional(readOnly = true)
    public List<HrLeaveScheduleDet> findByScheduleId(Long scheduleId) {
        return repository.findByHrLeaveScheduleId(scheduleId);
    }
}