package com.example.employee_management.service;

import com.example.employee_management.dto.LeaveScheduleDTO;
import com.example.employee_management.entity.LeaveSchedule;
import com.example.employee_management.repository.LeaveScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveScheduleService {

    private static final Logger logger = LoggerFactory.getLogger(LeaveScheduleService.class);
    private final LeaveScheduleRepository leaveScheduleRepository;
    // Optional:
    // private final EmployeeRepository employeeRepository;

    @Autowired
    public LeaveScheduleService(LeaveScheduleRepository leaveScheduleRepository /*, EmployeeRepository employeeRepository */) {
        this.leaveScheduleRepository = leaveScheduleRepository;
        // this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaveScheduleDTO> getLeaveSchedulesByEmployeeId(String employeeId) {
        logger.info("Fetching leave schedules for employeeId: {}", employeeId);
        List<LeaveSchedule> schedules = leaveScheduleRepository.findByEmployeeId(employeeId);
        if (schedules.isEmpty()) {
            logger.info("No leave schedules found for employeeId: {}", employeeId);
        }
        return schedules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LeaveScheduleDTO convertToDTO(LeaveSchedule schedule) {
        LeaveScheduleDTO dto = new LeaveScheduleDTO();
        dto.setId(schedule.getId());
        dto.setLeaveYearId(schedule.getLeaveYearId()); // Consider resolving this to a year or name
        dto.setEmployeeId(schedule.getEmployeeId());
        dto.setStatus(schedule.getStatus());
        dto.setDescription(schedule.getDescription());

        // Example: If you wanted to include employee name (requires EmployeeRepository and Employee entity)
        // Optional<Employee> employeeOpt = employeeRepository.findByEmpId(schedule.getEmployeeId());
        // employeeOpt.ifPresent(employee -> dto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName()));

        return dto;
    }
}