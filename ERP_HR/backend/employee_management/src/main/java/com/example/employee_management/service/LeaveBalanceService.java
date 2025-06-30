package com.example.employee_management.service;

import com.example.employee_management.dto.LeaveBalanceDTO;
import com.example.employee_management.dto.LeaveBalanceUpdateDTO;
import com.example.employee_management.entity.HrLeaveBalance;
import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.entity.HrLuLeaveYear;
import com.example.employee_management.repository.HrLeaveBalanceRepository;
import com.example.employee_management.repository.HrLuLeaveTypeRepository;
import com.example.employee_management.repository.HrLuLeaveYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveBalanceService {

    @Autowired
    private HrLeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private HrLuLeaveTypeRepository leaveTypesRepository;

    @Autowired
    private HrLuLeaveYearRepository leaveYearRepository;

    public HrLeaveBalance getLeaveBalance(String employeeId, Long leaveYearId, Long leaveTypeId) {
        HrLeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveYearIdAndLeaveTypeId(employeeId, leaveYearId, leaveTypeId);
        if (balance != null && balance.getRemainingDays() == null) {
            Float usedDays = balance.getUsedDays() != null ? balance.getUsedDays() : 0.0f;
            balance.setRemainingDays(balance.getTotalDays() != null ? balance.getTotalDays() - usedDays : 0.0f);
        }
        return balance;
    }

    public Iterable<HrLuLeaveType> getAllLeaveTypes() {
        return leaveTypesRepository.findAll();
    }

    public Iterable<HrLuLeaveYear> getAllLeaveYears() {
        return leaveYearRepository.findAll();
    }

    public Optional<HrLeaveBalance> getBalanceByEmployeeId(String employeeId) {
        return Optional.empty();
    }

    public List<HrLeaveBalance> getBalanceHistory(String employeeId) {
        return List.of();
    }

    public HrLeaveBalance updateBalance(Long id, LeaveBalanceUpdateDTO updateDTO) {
        return null;
    }

    public HrLeaveBalance createOrUpdateBalance(LeaveBalanceDTO dto) {
        return null;
    }
}