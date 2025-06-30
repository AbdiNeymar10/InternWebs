package com.example.employee_management.service;

import com.example.employee_management.entity.HrLeaveSetting;
import com.example.employee_management.repository.HrLeaveSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLeaveSettingService {

    private final HrLeaveSettingRepository repository;

    @Autowired
    public HrLeaveSettingService(HrLeaveSettingRepository repository) {
        this.repository = repository;
    }

    public List<HrLeaveSetting> findAll() {
        return repository.findAll();
    }

    public Optional<HrLeaveSetting> findById(Long id) {
        return repository.findById(id);
    }

    public List<HrLeaveSetting> findByLeaveTypeId(Long leaveTypeId) {
        return repository.findByLeaveType_Id(leaveTypeId);
    }

    public HrLeaveSetting save(HrLeaveSetting hrLeaveSetting) {
        return repository.save(hrLeaveSetting);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}