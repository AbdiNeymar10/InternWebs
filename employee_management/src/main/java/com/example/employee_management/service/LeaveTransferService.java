package com.example.employee_management.service;

import com.example.employee_management.dto.EmployeeDTO;
import com.example.employee_management.dto.LeaveTransferDetailDTO;
import com.example.employee_management.dto.LeaveTransferRequestDTO;
import com.example.employee_management.dto.SubmitLeaveTransferRequestDTO;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.entity.HrLeaveTransfer;
import com.example.employee_management.entity.HrLeaveTransferDetail;
import com.example.employee_management.repository.HrEmployeeRepository;
import com.example.employee_management.repository.HrLeaveTransferDetailRepository;
import com.example.employee_management.repository.HrLeaveTransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LeaveTransferService {

    @Autowired
    private HrEmployeeRepository employeeRepository;

    @Autowired
    private HrLeaveTransferRepository leaveTransferRepository;

    @Autowired
    private HrLeaveTransferDetailRepository leaveTransferDetailRepository;

    public EmployeeDTO getEmployeeDetails(String empId) {
        HrEmployee employee = employeeRepository.findEmployeeWithAllRelations(empId);
        if (employee == null) {
            throw new RuntimeException("Employee not found with EMP_ID: " + empId);
        }
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmpId(employee.getEmpId());
        dto.setFullName(employee.getFullNameEngWord() != null ? employee.getFullNameEngWord() :
                (employee.getFirstName() + " " + (employee.getMiddleName() != null ? employee.getMiddleName() + " " : "") + employee.getLastName()));
        // Set department to deptName instead of deptId
        dto.setDepartment(employee.getDepartment() != null ? employee.getDepartment().getDepName() : "Unknown");
        return dto;
    }

    public List<EmployeeDTO> getEmployeesInDepartment(String empId) {
        HrEmployee requester = employeeRepository.findEmployeeWithAllRelations(empId);
        if (requester == null) {
            throw new RuntimeException("Requester not found with EMP_ID: " + empId);
        }
        List<HrEmployee> employees = employeeRepository.findByDepartment_DeptId(requester.getDepartment().getDeptId());
        return employees.stream()
                .filter(emp -> !emp.getEmpId().equals(empId))
                .map(emp -> {
                    EmployeeDTO dto = new EmployeeDTO();
                    dto.setEmpId(emp.getEmpId());
                    dto.setFullName(emp.getFullNameEngWord() != null ? emp.getFullNameEngWord() :
                            (emp.getFirstName() + " " + (emp.getMiddleName() != null ? emp.getMiddleName() + " " : "") + emp.getLastName()));
                    // Set department to deptName instead of deptId
                    dto.setDepartment(emp.getDepartment() != null ? emp.getDepartment().getDepName() : "Unknown");
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void submitLeaveTransferRequest(SubmitLeaveTransferRequestDTO requestDTO) {
        HrLeaveTransfer leaveTransfer = new HrLeaveTransfer();
        leaveTransfer.setRequesterId(requestDTO.getRequesterId());
        leaveTransfer.setBudgetYear(requestDTO.getBudgetYear());
        leaveTransfer.setCreatedDate(LocalDateTime.now());

        List<HrLeaveTransferDetail> details = requestDTO.getDetails().stream().map(dto -> {
            HrLeaveTransferDetail detail = new HrLeaveTransferDetail();
            detail.setEmpId(dto.getEmpId());
            detail.setStatus(dto.getStatus());
            detail.setLeaveTransfer(leaveTransfer);
            return detail;
        }).collect(Collectors.toList());

        leaveTransfer.setDetails(details);
        leaveTransferRepository.save(leaveTransfer);
    }

    public List<LeaveTransferRequestDTO> getSubmittedRequests(String requesterId) {
        List<HrLeaveTransfer> transfers = leaveTransferRepository.findByRequesterId(requesterId);
        return transfers.stream().map(this::mapToLeaveTransferRequestDTO).collect(Collectors.toList());
    }

    public List<LeaveTransferRequestDTO> getPendingRequests() {
        List<HrLeaveTransferDetail> pendingDetails = leaveTransferDetailRepository.findByStatus("PENDING");
        return pendingDetails.stream()
                .map(HrLeaveTransferDetail::getLeaveTransfer)
                .distinct()
                .map(this::mapToLeaveTransferRequestDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveLeaveTransferDetail(Long detailId) {
        Optional<HrLeaveTransferDetail> detailOpt = leaveTransferDetailRepository.findById(detailId);
        if (!detailOpt.isPresent()) {
            throw new RuntimeException("Leave transfer detail not found with ID: " + detailId);
        }
        HrLeaveTransferDetail detail = detailOpt.get();
        detail.setStatus("APPROVED");
        leaveTransferDetailRepository.save(detail);
    }

    private LeaveTransferRequestDTO mapToLeaveTransferRequestDTO(HrLeaveTransfer transfer) {
        LeaveTransferRequestDTO dto = new LeaveTransferRequestDTO();
        dto.setTransferId(transfer.getTransferId());
        dto.setRequesterId(transfer.getRequesterId());
        dto.setBudgetYear(transfer.getBudgetYear());
        dto.setCreatedDate(transfer.getCreatedDate().toString());
        dto.setStatus(transfer.getDetails().stream().allMatch(detail -> "APPROVED".equals(detail.getStatus())) ? "APPROVED" : "PENDING");
        // Fetch department name for requester
        HrEmployee requester = employeeRepository.findEmployeeWithAllRelations(transfer.getRequesterId());
        dto.setDeptName(requester != null && requester.getDepartment() != null ? requester.getDepartment().getDepName() : "Unknown");
        dto.setDetails(transfer.getDetails().stream().map(detail -> {
            LeaveTransferDetailDTO detailDTO = new LeaveTransferDetailDTO();
            detailDTO.setDetailId(detail.getDetailId());
            detailDTO.setEmpId(detail.getEmpId());
            detailDTO.setStatus(detail.getStatus());
            return detailDTO;
        }).collect(Collectors.toList()));
        return dto;
    }
}