package com.example.employee_management.service;

import com.example.employee_management.dto.LeaveHistoryDto;
import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.LeaveHistory;
import com.example.employee_management.repository.EmployeeRepository;
import com.example.employee_management.repository.LeaveHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LeaveHistoryService {

    private final LeaveHistoryRepository leaveHistoryRepository;
    private final EmployeeRepository employeeRepository;

    // Catalog for leave types (similar to LeaveRequestController)
    // In a real application, this should come from a database or a shared service.
    private static final List<Map<String, Object>> LEAVE_TYPES_CATALOG = List.of(
            Map.of("id", 1L, "leaveName", "Annual"),
            Map.of("id", 2L, "leaveName", "Sick"),
            Map.of("id", 3L, "leaveName", "Maternity"),
            Map.of("id", 4L, "leaveName", "Paternity"),
            Map.of("id", 5L, "leaveName", "Bereavement")
            // Add other leave types as needed
    );

    private String getLeaveNameById(Long leaveTypeId) {
        if (leaveTypeId == null) return "Unknown";
        return LEAVE_TYPES_CATALOG.stream()
                .filter(lt -> leaveTypeId.equals(lt.get("id")))
                .map(lt -> (String) lt.get("leaveName"))
                .findFirst()
                .orElse("Unknown");
    }

    private Long getLeaveTypeIdByName(String leaveName) {
        if (leaveName == null || leaveName.trim().isEmpty()) return null; // Or throw exception
        return LEAVE_TYPES_CATALOG.stream()
                .filter(lt -> leaveName.equalsIgnoreCase((String) lt.get("leaveName")))
                .map(lt -> (Long) lt.get("id"))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid leave name: " + leaveName));
    }


    @Autowired
    public LeaveHistoryService(LeaveHistoryRepository leaveHistoryRepository, EmployeeRepository employeeRepository) {
        this.leaveHistoryRepository = leaveHistoryRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<LeaveHistory> getRawLeaveHistoryByEmployeeId(String empId) {
        return leaveHistoryRepository.findByEmployeeEmpId(empId);
    }

    @Transactional(readOnly = true)
    public List<LeaveHistoryDto> getLeaveHistoryByEmployeeId(String empId) {
        List<LeaveHistory> histories = leaveHistoryRepository.findByEmployeeEmpId(empId);
        return histories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveHistoryDto createLeaveHistory(LeaveHistoryDto dto) {
        Employee employee = employeeRepository.findByEmpId(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with empId: " + dto.getEmployeeId()));

        boolean exists = leaveHistoryRepository.existsByEmployeeAndFromDateAndToDate(
                employee,
                dto.getFromDate(),
                dto.getToDate());

        if (exists) {
            throw new RuntimeException("Leave request already exists for these dates");
        }

        LeaveHistory history = new LeaveHistory();
        history.setEmployee(employee);
        history.setFromDate(dto.getFromDate());
        history.setToDate(dto.getToDate());
        history.setStatus(dto.getStatus() != null ? dto.getStatus() : "Pending");

        // Convert leaveName from DTO to leaveTypeId for Entity
        Long leaveTypeId = getLeaveTypeIdByName(dto.getLeaveName());
        history.setLeaveTypeId(leaveTypeId);

        if (dto.getFromDate() != null) {
            history.setYear(String.valueOf(dto.getFromDate().getYear()));
        } else {
            history.setYear(String.valueOf(LocalDate.now().getYear()));
        }
        // Use requestedDate from DTO if provided, otherwise default to now
        history.setRequestedDate(dto.getRequestedDate() != null ? dto.getRequestedDate() : LocalDate.now());
        history.setAvailableDays(dto.getAvailableDays() != null ? dto.getAvailableDays() : 0);
        history.setApprovedBy(dto.getApprovedBy() != null ? dto.getApprovedBy() : "SYSTEM_PENDING");
        history.setPayment(dto.getPayment() != null ? dto.getPayment() : "UNPAID");
        history.setExpiry(dto.getExpiry() != null ? dto.getExpiry() : "");
        history.setDescription(dto.getDescription() != null ? dto.getDescription() : "");

        LeaveHistory saved = leaveHistoryRepository.save(history);
        return convertToDto(saved);
    }

    @Transactional
    public LeaveHistoryDto updateLeaveStatus(Long id, String status, boolean isHrApproval) {
        LeaveHistory history = leaveHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave history not found with ID: " + id));

        String newStatus = isHrApproval ? "HR_" + status : "DEPT_" + status;
        history.setStatus(newStatus);

        LeaveHistory updatedHistory = leaveHistoryRepository.save(history);
        return convertToDto(updatedHistory);
    }

    @Transactional(readOnly = true)
    public LeaveHistoryDto getLeaveHistoryById(Long id) {
        return leaveHistoryRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Leave history not found with ID: " + id));
    }

    @Transactional
    public void deleteLeaveHistory(Long id) {
        if (!leaveHistoryRepository.existsById(id)) {
            throw new RuntimeException("Leave history not found with ID: " + id);
        }
        leaveHistoryRepository.deleteById(id);
    }

    private LeaveHistoryDto convertToDto(LeaveHistory history) {
        LeaveHistoryDto dto = new LeaveHistoryDto();
        dto.setId(history.getId());
        if (history.getEmployee() != null) {
            dto.setEmployeeId(history.getEmployee().getEmpId());
            dto.setEmployeeName(history.getEmployee().getFirstName() + " " + history.getEmployee().getLastName());
        }
        dto.setYear(history.getYear());
        dto.setFromDate(history.getFromDate());
        dto.setToDate(history.getToDate());
        dto.setAvailableDays(history.getAvailableDays());
        dto.setStatus(history.getStatus());
        dto.setApprovedBy(history.getApprovedBy());

        // Convert leaveTypeId from Entity to leaveName for DTO
        dto.setLeaveName(getLeaveNameById(history.getLeaveTypeId()));

        dto.setDescription(history.getDescription());
        dto.setPayment(history.getPayment());
        dto.setExpiry(history.getExpiry());
        dto.setRequestedDate(history.getRequestedDate());
        return dto;
    }
}