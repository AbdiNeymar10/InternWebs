package com.example.employee_management.service;

import com.example.employee_management.dto.FullJobDetailsResponseDto;
import com.example.employee_management.dto.RecruitmentJobCodeBatchDto;
import com.example.employee_management.entity.RecruitmentRequesttwo;
import com.example.employee_management.entity.HrJobType;
import com.example.employee_management.entity.HrJobTypeDetail;
import com.example.employee_management.repository.RecruitmentRequestRepositorytwo;
import com.example.employee_management.repository.HrJobTypeRepository;
import com.example.employee_management.repository.HrJobTypeDetailRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
// import java.util.Optional;

@Service
public class RecruitmentServicetwo {

    @Autowired
    private RecruitmentRequestRepositorytwo requestRepository;

    @Autowired
    private HrJobTypeRepository hrJobTypeRepository;

    @Autowired
    private HrJobTypeDetailRepository hrJobTypeDetailRepository;

    @Transactional
    public RecruitmentRequesttwo createRequest(RecruitmentRequesttwo request) {
        // Handle JOB_CODE mapping
        if (request.getJobCodeDetail() != null && request.getJobCodeDetail().getId() != null) {
            HrJobTypeDetail detail = hrJobTypeDetailRepository.findById(request.getJobCodeDetail().getId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Provided HrJobTypeDetail ID not found: " + request.getJobCodeDetail().getId()));
            request.setJobCodeDetail(detail);
        } else if (request.getJobType() != null && request.getJobType().getId() != null) {
            Long hrLuJobTypeId = request.getJobType().getId();
            HrJobType selectedHrJobType = hrJobTypeRepository.findByJobTitle_Id(hrLuJobTypeId).stream().findFirst()
                    .orElseThrow(() -> new EntityNotFoundException(
                            "No HrJobType found for selected Job Title ID: " + hrLuJobTypeId));

            HrJobTypeDetail finalJobCodeDetail = hrJobTypeDetailRepository.findByHrJobType(selectedHrJobType).stream()
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException(
                            "No HrJobTypeDetail found for HrJobType ID: " + selectedHrJobType.getId()));

            request.setJobCodeDetail(finalJobCodeDetail);
            request.setJobType(null); // Nullify temporary field
        } else {
            throw new IllegalArgumentException(
                    "A valid Job Code (HrJobTypeDetail ID) or Job Title (HrLuJobType ID) is required.");
        }

        request.setRequestStatus("PENDING");
        request.setUpdatedDate(LocalDate.now());

        // FIXED: Removed the risky and incorrect data conversion block.
        // The service should trust that the incoming `request` object has correctly
        // typed data.

        return requestRepository.save(request);
    }

    public List<RecruitmentRequesttwo> getPendingRequests() {
        return requestRepository.findByRequestStatus("PENDING");
    }

    @Transactional
    public RecruitmentRequesttwo processApproval(Long requestId, String decision, String remark, String approvedBy) {
        RecruitmentRequesttwo request = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Recruitment request not found with ID: " + requestId));

        request.setRequestStatus("APPROVE".equalsIgnoreCase(decision) ? "APPROVED" : "REJECTED");
        request.setGmRemark(remark);
        request.setApprovedBy(approvedBy);
        request.setGmApprovedDate(LocalDate.now());
        request.setUpdatedDate(LocalDate.now());

        return requestRepository.save(request);
    }

    @Transactional
    public RecruitmentRequesttwo updateRequest(Long id, RecruitmentRequesttwo requestDetails) {
        RecruitmentRequesttwo existingRequest = requestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recruitment request not found with id: " + id));

        // This block is very verbose. A mapping library like MapStruct is recommended.
        if (requestDetails.getDepartment() != null) {
            existingRequest.setDepartment(requestDetails.getDepartment());
        }
        if (requestDetails.getJobCodeDetail() != null) {
            existingRequest.setJobCodeDetail(requestDetails.getJobCodeDetail());
        }
        // ... and so on for all other fields ...
        if (requestDetails.getSalary() != null) {
            existingRequest.setSalary(requestDetails.getSalary());
        }

        existingRequest.setUpdatedDate(LocalDate.now());

        return requestRepository.save(existingRequest);
    }

    @Transactional
    public void deleteRequest(Long id) {
        if (!requestRepository.existsById(id)) {
            throw new EntityNotFoundException("Cannot delete. Recruitment request not found with id: " + id);
        }
        requestRepository.deleteById(id);
    }

    public List<RecruitmentJobCodeBatchDto> getJobCodesAndBatchCodesByAdvertisementType(String advertisementType) {
        return requestRepository.findJobCodesAndBatchCodesByAdvertisementType(advertisementType);
    }

    public List<FullJobDetailsResponseDto> getFullJobDetailsByJobTitle(Long jobTitleId) {
        return requestRepository.findFullJobDetailsByJobTitleId(jobTitleId);
    }
}