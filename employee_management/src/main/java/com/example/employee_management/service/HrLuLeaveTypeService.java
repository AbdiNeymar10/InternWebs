package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.repository.HrLuLeaveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuLeaveTypeService {

    private final HrLuLeaveTypeRepository repository;

    @Autowired
    public HrLuLeaveTypeService(HrLuLeaveTypeRepository repository) {
        this.repository = repository;
    }

    public List<HrLuLeaveType> findAll() {
        return repository.findAll();
    }

    public Optional<HrLuLeaveType> findById(Long id) {
        return repository.findById(id);
    }

    public HrLuLeaveType save(HrLuLeaveType leaveType) {
        return repository.save(leaveType);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}