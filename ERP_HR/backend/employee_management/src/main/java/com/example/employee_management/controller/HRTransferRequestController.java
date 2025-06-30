package com.example.employee_management.controller;

import com.example.employee_management.dto.TransferRequestDto;
import com.example.employee_management.entity.HRTransferRequest;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.entity.HRJob_TypeDetail;
import com.example.employee_management.entity.HRJob_Type;
import com.example.employee_management.repository.HrEmployeeRepository;
import com.example.employee_management.repository.DepartmentRepository;
import com.example.employee_management.repository.HRJob_TypeDetailRepository;
import com.example.employee_management.repository.HRPay_GradRepository;
import com.example.employee_management.repository.HrLuResponsibilityRepository;
import com.example.employee_management.repository.HrLuBranchRepository;
import com.example.employee_management.repository.HRJob_TypeRepository;
import com.example.employee_management.service.HRTransferRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/hr-transfer-requests")
public class HRTransferRequestController {

    @Autowired
    private HRTransferRequestService service;

    @Autowired
    private HrEmployeeRepository hrEmployeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private HRJob_TypeDetailRepository hrJobTypeDetailRepository;

    @Autowired
    private HRPay_GradRepository hrPayGradRepository;

    @Autowired
    private HrLuResponsibilityRepository hrLuResponsibilityRepository;

    @Autowired
    private HrLuBranchRepository hrLuBranchRepository;

    @Autowired
    private HRJob_TypeRepository hrJobTypeRepository;

    @GetMapping
    public List<TransferRequestDto> getAll() {
        List<HRTransferRequest> entities = service.getAll();
        List<TransferRequestDto> dtos = new java.util.ArrayList<>();
        for (HRTransferRequest entity : entities) {
            TransferRequestDto dto = new TransferRequestDto();
            dto.setEmployeeName(entity.getEmployee() != null ? entity.getEmployee().getFirstName() : null);
            dto.setEmpId(entity.getEmployee() != null ? entity.getEmployee().getEmpId() : null);
            dto.setGender(entity.getEmployee() != null ? entity.getEmployee().getSex() : null);
            dto.setHiredDate(entity.getEmployee() != null ? entity.getEmployee().getHiredDate() : null);
            dto.setIcf(entity.getIcf() != null ? entity.getIcf().toString() : null);
            dto.setDescription(entity.getDescription());
            dto.setDateRequest(entity.getDateRequest());
            dto.setTransferType(entity.getTransferType());
            dto.setJobPositionId(entity.getJobPosition() != null ? entity.getJobPosition().getId() : null);
            dto.setTransferFromId(entity.getTransferFrom() != null ? entity.getTransferFrom().getDeptId() : null);
            dto.setTransferToId(entity.getTransferTo() != null ? entity.getTransferTo().getDeptId() : null);
            dto.setPayGradeId(entity.getNewJobPayGrade() != null ? entity.getNewJobPayGrade().getPayGradeId() : null);
            dto.setJobResponsibilityId(entity.getResponsibility() != null ? entity.getResponsibility().getId() : null);
            dto.setBranchId(entity.getBiranchId() != null ? entity.getBiranchId().getId() : null);
            dto.setJobCodeId(entity.getJobCode() != null ? entity.getJobCode().getId() : null);
            dto.setStatus(entity.getStatus());
            dto.setRemark(entity.getRemark());
            dto.setApprovedBy(entity.getApprovedBy());
            dto.setBranchFromId(entity.getBranchFrom() != null ? Long.valueOf(entity.getBranchFrom()) : null);
            dto.setPreparedDate(entity.getPreparedDate());
            dto.setCheckedDate(entity.getCheckedDate());
            dto.setAuthorizedDate(entity.getAuthorizedDate());
            dto.setTransferRequesterId(entity.getTransferRequesterId());
            dto.setApproveDate(entity.getApproveDate());
            dto.setSalary(entity.getSalary());
            dto.setEmploymentType(entity.getEmploymentType());
            // dto.setStepNo(entity.getStepNo());
            dtos.add(dto);
        }
        return dtos;
    }

    @GetMapping("/{id}")
    public Optional<HRTransferRequest> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HRTransferRequest create(@RequestBody TransferRequestDto dto) {
        HRTransferRequest request = new HRTransferRequest();
        if (dto.getEmpId() != null) {
            HrEmployee employee = hrEmployeeRepository.findById(dto.getEmpId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            request.setEmployee(employee);
        }
        request.setDescription(dto.getDescription());
        request.setDateRequest(dto.getDateRequest());
        request.setTransferType(dto.getTransferType());
        request.setStatus("0");
        if (dto.getTransferFromId() != null) {
            request.setTransferFrom(departmentRepository.findById(dto.getTransferFromId()).orElse(null));
        }
        if (dto.getTransferToId() != null) {
            request.setTransferTo(departmentRepository.findById(dto.getTransferToId()).orElse(null));
        }
        if (dto.getJobPositionId() != null) {
            HRJob_TypeDetail jobTypeDetail = hrJobTypeDetailRepository
                    .findById(Long.valueOf(dto.getJobPositionId().toString())).orElse(null);
            if (jobTypeDetail != null) {
                request.setJobPosition(jobTypeDetail);
            }
        }
        if (dto.getPayGradeId() != null) {
            request.setNewJobPayGrade(hrPayGradRepository.findById(dto.getPayGradeId()).orElse(null));
        }
        if (dto.getJobResponsibilityId() != null) {
            request.setResponsibility(hrLuResponsibilityRepository.findById(dto.getJobResponsibilityId()).orElse(null));
        }
        if (dto.getBranchId() != null) {
            request.setBiranchId(hrLuBranchRepository.findById(dto.getBranchId()).orElse(null));
        }
        if (dto.getJobCodeId() != null) {
            HRJob_Type jobType = hrJobTypeRepository.findById(Long.valueOf(dto.getJobCodeId().toString())).orElse(null);
            if (jobType != null) {
                request.setJobCode(jobType);
            }
        }
        if (dto.getBranchFromId() != null) {
            request.setBranchFrom(dto.getBranchFromId().toString());
        }
        if (dto.getIcfId() != null) {
            request.setIcf(dto.getIcfId());
        }
        if (dto.getSalary() != null) {
            request.setSalary(dto.getSalary());
        }
        if (dto.getEmploymentType() != null) {
        request.setEmploymentType(dto.getEmploymentType());
      }

        return service.save(request);
    }

    @PutMapping("/{id}")
    public HRTransferRequest update(@PathVariable Long id, @RequestBody TransferRequestDto dto) {
        HRTransferRequest request = service.getById(id)
                .orElseThrow(() -> new RuntimeException("Transfer request not found"));

        if (dto.getTransferRequesterId() != null) {
            request.setTransferRequesterId(dto.getTransferRequesterId());
        }
        if (dto.getEmpId() != null) {
            HrEmployee employee = hrEmployeeRepository.findById(dto.getEmpId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            request.setEmployee(employee);
        }
        if (dto.getDescription() != null && !dto.getDescription().trim().isEmpty()) {
            request.setDescription(dto.getDescription());
        }
        if (dto.getDateRequest() != null && !dto.getDateRequest().trim().isEmpty()) {
            request.setDateRequest(dto.getDateRequest());
        }
        if (dto.getTransferType() != null && !dto.getTransferType().trim().isEmpty()) {
            request.setTransferType(dto.getTransferType());
        }
        if (dto.getTransferFromId() != null) {
            request.setTransferFrom(departmentRepository.findById(dto.getTransferFromId()).orElse(null));
        }
        if (dto.getTransferToId() != null) {
            request.setTransferTo(departmentRepository.findById(dto.getTransferToId()).orElse(null));
        }
        if (dto.getJobPositionId() != null) {
            HRJob_TypeDetail jobTypeDetail = hrJobTypeDetailRepository.findById(dto.getJobPositionId()).orElse(null);
            if (jobTypeDetail != null) {
                request.setJobPosition(jobTypeDetail);
            }
        }
        if (dto.getPayGradeId() != null) {
            request.setNewJobPayGrade(hrPayGradRepository.findById(dto.getPayGradeId()).orElse(null));
        }
        if (dto.getJobResponsibilityId() != null) {
            request.setResponsibility(hrLuResponsibilityRepository.findById(dto.getJobResponsibilityId()).orElse(null));
        }
        if (dto.getBranchId() != null) {
            request.setBiranchId(hrLuBranchRepository.findById(dto.getBranchId()).orElse(null));
        }
        if (dto.getJobCodeId() != null) {
            HRJob_Type jobType = hrJobTypeRepository.findById(dto.getJobCodeId()).orElse(null);
            if (jobType != null) {
                request.setJobCode(jobType);
            }
        }
        if (dto.getStatus() != null) {
            request.setStatus(dto.getStatus());
        }
        if (dto.getRemark() != null) {
            request.setRemark(dto.getRemark());
        }
        if (dto.getApprovedBy() != null) {
            request.setApprovedBy(dto.getApprovedBy());
        }
        if (dto.getApproveDate() != null) {
            request.setApproveDate(dto.getApproveDate());
        }
        if (dto.getPreparedDate() != null) {
            request.setPreparedDate(dto.getPreparedDate());
        }
        if (dto.getCheckedDate() != null) {
            request.setCheckedDate(dto.getCheckedDate());
        }
        if (dto.getAuthorizedDate() != null) {
            request.setAuthorizedDate(dto.getAuthorizedDate());
        }
        if (dto.getBranchFromId() != null) {
            request.setBranchFrom(dto.getBranchFromId().toString());
        }
        if (dto.getIcfId() != null) {
            request.setIcf(dto.getIcfId());
        }
        if (dto.getSalary() != null) {
            request.setSalary(dto.getSalary());
        }
        if (dto.getEmploymentType() != null) {
            request.setEmploymentType(dto.getEmploymentType());
        }
        return service.save(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
