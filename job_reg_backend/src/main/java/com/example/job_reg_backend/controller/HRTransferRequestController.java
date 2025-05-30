package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.dto.TransferRequestDto;
import com.example.job_reg_backend.model.HRTransferRequest;
import com.example.job_reg_backend.model.HrEmployee;
import com.example.job_reg_backend.model.HRJobTypeDetail;
import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.repository.HrEmployeeRepository;
import com.example.job_reg_backend.repository.DepartmentRepository;
import com.example.job_reg_backend.repository.HRJobTypeDetailRepository;
import com.example.job_reg_backend.repository.HRPayGradRepository;
import com.example.job_reg_backend.repository.HRLuResponsibilityRepository;
import com.example.job_reg_backend.repository.HRLuBranchRepository;
import com.example.job_reg_backend.repository.HRJobTypeRepository;
import com.example.job_reg_backend.service.HRTransferRequestService;
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
    private HRJobTypeDetailRepository hrJobTypeDetailRepository;

    @Autowired
    private HRPayGradRepository hrPayGradRepository;

    @Autowired
    private HRLuResponsibilityRepository hrLuResponsibilityRepository;

    @Autowired
    private HRLuBranchRepository hrLuBranchRepository;
    
    @Autowired
    private HRJobTypeRepository hrJobTypeRepository;

    @GetMapping
    public List<HRTransferRequest> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<HRTransferRequest> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HRTransferRequest create(@RequestBody TransferRequestDto dto) {
        HRTransferRequest request = new HRTransferRequest();
        if (dto.getEmpId() != null) {
            HrEmployee employee = hrEmployeeRepository.findById(dto.getEmpId()).orElseThrow(() -> new RuntimeException("Employee not found"));
            request.setEmployee(employee);
        }
        request.setEmployeeName(dto.getEmployeeName());
        request.setGender(dto.getGender());
        request.setIcf(dto.getIcf());
        request.setDescription(dto.getDescription());
        request.setDateRequest(dto.getDateRequest());
        request.setTransferType(dto.getTransferType());
        if (dto.getTransferFromId() != null) {
            request.setTransferFrom(departmentRepository.findById(dto.getTransferFromId()).orElse(null));
        }
        if (dto.getTransferToId() != null) {
            request.setTransferTo(departmentRepository.findById(dto.getTransferToId()).orElse(null));
        }
        if (dto.getJobPositionId() != null) {
            HRJobTypeDetail jobTypeDetail = hrJobTypeDetailRepository.findById(Long.valueOf(dto.getJobPositionId().toString())).orElse(null);
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
            HRJobType jobType = hrJobTypeRepository.findById(Long.valueOf(dto.getJobCodeId().toString())).orElse(null);
            if (jobType != null) {
                request.setJobCode(jobType);
            }
        }
        return service.save(request);
    }

    @PutMapping("/{id}")
    public HRTransferRequest update(@PathVariable Long id, @RequestBody HRTransferRequest request) {
        request.setTransferRequesterId(id);
        return service.save(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
