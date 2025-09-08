package com.example.employee_management.service;

import com.example.employee_management.dto.HrPayGradeDto;
import com.example.employee_management.dto.RecruitmentRequestDisplayDto;
import com.example.employee_management.entity.*;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RecruitmentService {

    @Autowired
    private RecruitmentRequestRepository requestRepository;
    @Autowired
    private HrJobTypeRepository hrJobTypeRepository;
    @Autowired
    private HrJobTypeDetailRepository hrJobTypeDetailRepository;
    @Autowired
    private HrRankRepository rankRepository;
    @Autowired
    private HrPayGradeService hrPayGradeService;

    @Transactional
    public RecruitmentRequest createRequest(RecruitmentRequest request) {
        // --- Step 1: Validate required inputs from frontend ---
        if (request.getJobTypeId() == null) {
            throw new IllegalArgumentException("Job Title (HrLuJobType ID) is required.");
        }
        if (request.getIncrementStep() == null || request.getIncrementStep().trim().isEmpty()) {
            throw new IllegalArgumentException("Increment Step is required.");
        }
        if (request.getSalary() == null || request.getSalary().trim().isEmpty()) {
            throw new IllegalArgumentException("Salary is required from the frontend.");
        }
        if (request.getEmploymentTypeId() == null) {
            throw new IllegalArgumentException("Employment Type ID is required.");
        }
        if (request.getEmploymentTypeName() == null || request.getEmploymentTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Employment Type Name is required.");
        }

        // --- Validate uniqueness of RECRUIT_BATCH_CODE case-insensitively ---
        if (request.getRecruitBatchCode() != null && !request.getRecruitBatchCode().trim().isEmpty()) {
            String incomingBatchCode = request.getRecruitBatchCode().trim();
            Optional<RecruitmentRequest> existingRequest = requestRepository
                    .findByRecruitBatchCodeIgnoreCase(incomingBatchCode);

            if (existingRequest.isPresent()) {
                throw new IllegalArgumentException(
                        "Recruit Batch Code '" + incomingBatchCode + "' already exists. Please use a unique code.");
            }
        } else {
            throw new IllegalArgumentException("Recruit Batch Code is required and cannot be empty.");
        }

        // --- Step 2: Find the correct Job Code Detail based on the Job Title ID ---
        Integer hrLuJobTypeId = request.getJobTypeId();
        List<HrJobType> hrJobTypes = hrJobTypeRepository.findByJobTitle_Id(hrLuJobTypeId.longValue());
        if (hrJobTypes.isEmpty()) {
            throw new ResourceNotFoundException("No HrJobType found for selected Job Title ID: " + hrLuJobTypeId);
        }
        HrJobType selectedHrJobType = hrJobTypes.get(0);

        List<HrJobTypeDetail> hrJobTypeDetails = hrJobTypeDetailRepository.findByHrJobType(selectedHrJobType);
        if (hrJobTypeDetails.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No HrJobTypeDetail found for HrJobType ID: " + selectedHrJobType.getId());
        }
        HrJobTypeDetail finalJobCodeDetail = hrJobTypeDetails.get(0);
        request.setJobCodeDetail(finalJobCodeDetail);

        // --- Step 3: Determine Rank and Pay Grade ---
        HrRank targetRank = null;
        if (finalJobCodeDetail.getIcfId() != null && selectedHrJobType.getJobGrade() != null) {
            Long icfId = finalJobCodeDetail.getIcfId();
            Long jobGradeId = selectedHrJobType.getJobGrade().getId();

            List<HrRank> ranks = rankRepository.findByJobGradeIdAndIcfId(jobGradeId, icfId);
            if (!ranks.isEmpty()) {
                targetRank = ranks.get(0);
                request.setRank(new BigDecimal(targetRank.getRankId()));
            }
        }

        if (targetRank == null) {
            throw new ResourceNotFoundException(
                    "Could not determine Rank for the given Job Title and ICF combination. Please ensure a valid rank exists.");
        }

        String incrementStepStr = request.getIncrementStep();
        Optional<HrPayGradeDto> optionalPayGradDto = hrPayGradeService.findByRankIdAndStepNo(targetRank,
                incrementStepStr);

        if (optionalPayGradDto.isEmpty()) {
            throw new ResourceNotFoundException("Could not find a matching Pay Grade for Rank ID: "
                    + targetRank.getRankId() + " and Increment Step: " + incrementStepStr);
        }
        HrPayGradeDto foundPayGradDto = optionalPayGradDto.get();
        request.setPayGrade(new BigDecimal(foundPayGradDto.getPayGradeId()));
        request.setSalary(foundPayGradDto.getDecryptedSalary());

        // --- Serialize incrementStep and employmentType into selectionRemark ---
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> additionalDetails = new HashMap<>();

        if (request.getIncrementStep() != null) {
            additionalDetails.put("incrementStep", request.getIncrementStep());
        }
        if (request.getEmploymentTypeName() != null) {
            additionalDetails.put("employmentType", request.getEmploymentTypeName());
        }

        try {
            String jsonString = objectMapper.writeValueAsString(additionalDetails);
            request.setSelectionRemark(jsonString);
        } catch (Exception e) {
            // In a real app, you might want to log this error more formally
            System.err.println("Error serializing additional details for recruitment request: " + e.getMessage());
        }

        // --- Set initial status and default values before saving ---
        request.setRequestStatus("PENDING");
        request.setChecked("0");

        return requestRepository.save(request);
    }

    @Transactional
    public RecruitmentRequest updateRequest(RecruitmentRequest request) {
        RecruitmentRequest existingRequest = requestRepository.findById(request.getRecruitRequestId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recruitment Request not found with ID: " + request.getRecruitRequestId()));

        // --- Validation ---
        if (request.getJobTypeId() == null) {
            throw new IllegalArgumentException("Job Title (HrLuJobType ID) is required.");
        }
        if (request.getIncrementStep() == null || request.getIncrementStep().trim().isEmpty()) {
            throw new IllegalArgumentException("Increment Step is required.");
        }
        if (request.getEmploymentTypeId() == null) {
            throw new IllegalArgumentException("Employment Type ID is required.");
        }
        if (request.getEmploymentTypeName() == null || request.getEmploymentTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Employment Type Name is required.");
        }

        if (request.getRecruitBatchCode() != null && !request.getRecruitBatchCode().trim().isEmpty()) {
            String incomingBatchCode = request.getRecruitBatchCode().trim();
            Optional<RecruitmentRequest> existingRequestWithSameBatchCode = requestRepository
                    .findByRecruitBatchCodeIgnoreCase(incomingBatchCode);

            if (existingRequestWithSameBatchCode.isPresent() &&
                    !existingRequestWithSameBatchCode.get().getRecruitRequestId()
                            .equals(request.getRecruitRequestId())) {
                throw new IllegalArgumentException(
                        "Recruit Batch Code '" + incomingBatchCode + "' already exists for another request.");
            }
        } else {
            throw new IllegalArgumentException("Recruit Batch Code is required and cannot be empty.");
        }

        // --- Update fields ---
        existingRequest.setGmRemark(request.getGmRemark());
        existingRequest.setNumOfEmps(request.getNumOfEmps());
        existingRequest.setRecruitBatchCode(request.getRecruitBatchCode());
        existingRequest.setRecruitRequestType(request.getRecruitRequestType());
        existingRequest.setRemark(request.getRemark());
        existingRequest.setRequesterId(request.getRequesterId());
        existingRequest.setUpdatedDate(String.valueOf(LocalDate.now()));
        existingRequest.setEndDate(request.getEndDate());
        existingRequest.setBudgetYear(request.getBudgetYear());
        existingRequest.setAdvertisementType(request.getAdvertisementType());
        existingRequest.setAdvertized(request.getAdvertized());
        existingRequest.setChecked(request.getChecked());
        existingRequest.setDescription(request.getDescription());

        // --- Update relationships ---
        if (request.getDepartment() != null && request.getDepartment().getDeptId() != null) {
            Department department = new Department();
            department.setDeptId(request.getDepartment().getDeptId());
            existingRequest.setDepartment(department);
        } else {
            existingRequest.setDepartment(null);
        }

        if (request.getIcf() != null && request.getIcf().getId() != null) {
            HrLuIcf icf = new HrLuIcf();
            icf.setId(request.getIcf().getId());
            existingRequest.setIcf(icf);
        } else {
            existingRequest.setIcf(null);
        }

        if (request.getPositionName() != null && request.getPositionName().getId() != null) {
            HrLuPositionName positionName = new HrLuPositionName();
            positionName.setId(request.getPositionName().getId());
            existingRequest.setPositionName(positionName);
        } else {
            existingRequest.setPositionName(null);
        }

        if (request.getRecruitmentType() != null && request.getRecruitmentType().getRecruitmentType() != null) {
            HrLuRecruitmentType recruitmentType = new HrLuRecruitmentType();
            recruitmentType.setRecruitmentType(request.getRecruitmentType().getRecruitmentType());
            existingRequest.setRecruitmentType(recruitmentType);
        } else {
            existingRequest.setRecruitmentType(null);
        }

        // --- Re-derive Job Code Detail, Rank, and Pay Grade ---
        Integer hrLuJobTypeId = request.getJobTypeId();
        List<HrJobType> hrJobTypes = hrJobTypeRepository.findByJobTitle_Id(hrLuJobTypeId.longValue());
        if (hrJobTypes.isEmpty()) {
            throw new ResourceNotFoundException("No HrJobType found for selected Job Title ID: " + hrLuJobTypeId);
        }
        HrJobType selectedHrJobType = hrJobTypes.get(0);

        List<HrJobTypeDetail> hrJobTypeDetails = hrJobTypeDetailRepository.findByHrJobType(selectedHrJobType);
        if (hrJobTypeDetails.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No HrJobTypeDetail found for HrJobType ID: " + selectedHrJobType.getId());
        }
        HrJobTypeDetail finalJobCodeDetail = hrJobTypeDetails.get(0);
        existingRequest.setJobCodeDetail(finalJobCodeDetail);

        HrRank targetRank = null;
        if (finalJobCodeDetail.getIcfId() != null && selectedHrJobType.getJobGrade() != null) {
            Long icfId = finalJobCodeDetail.getIcfId();
            Long jobGradeId = selectedHrJobType.getJobGrade().getId();
            List<HrRank> ranks = rankRepository.findByJobGradeIdAndIcfId(jobGradeId, icfId);
            if (!ranks.isEmpty()) {
                targetRank = ranks.get(0);
                existingRequest.setRank(new BigDecimal(targetRank.getRankId()));
            }
        }

        if (targetRank == null) {
            throw new ResourceNotFoundException(
                    "Could not determine Rank for the given Job Title and ICF combination.");
        }

        String incrementStepStr = request.getIncrementStep();
        Optional<HrPayGradeDto> optionalPayGradDto = hrPayGradeService.findByRankIdAndStepNo(targetRank,
                incrementStepStr);
        if (optionalPayGradDto.isEmpty()) {
            throw new ResourceNotFoundException("Could not find a matching Pay Grade for Rank ID: "
                    + targetRank.getRankId() + " and Increment Step: " + incrementStepStr);
        }
        HrPayGradeDto foundPayGradDto = optionalPayGradDto.get();
        existingRequest.setPayGrade(new BigDecimal(foundPayGradDto.getPayGradeId()));
        existingRequest.setSalary(foundPayGradDto.getDecryptedSalary());

        // --- Re-serialize selectionRemark ---
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> additionalDetails = new HashMap<>();
        if (request.getIncrementStep() != null) {
            additionalDetails.put("incrementStep", request.getIncrementStep());
        }
        if (request.getEmploymentTypeName() != null) {
            additionalDetails.put("employmentType", request.getEmploymentTypeName());
        }
        try {
            String jsonString = objectMapper.writeValueAsString(additionalDetails);
            existingRequest.setSelectionRemark(jsonString);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process request details for update.", e);
        }

        return requestRepository.save(existingRequest);
    }

    public List<RecruitmentRequest> getPendingRequests() {
        return requestRepository.findByRequestStatus("PENDING");
    }

    /**
     * Fetches a single recruitment request by its ID and converts it to a DTO.
     * This method is transactional to ensure all lazy-loaded associations
     * (like jobGrade within jobCodeDetail) are fetched before the session closes.
     *
     * @param id The ID of the recruitment request.
     * @return The DTO representation of the request.
     */
    // v-- THIS IS THE FIX --v
    @Transactional(readOnly = true)
    public RecruitmentRequestDisplayDto getRecruitmentRequestById(Long id) {
        RecruitmentRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruitment Request not found with ID: " + id));
        // The fromEntity conversion now happens inside the transaction, allowing
        // lazy-loading to work
        return RecruitmentRequestDisplayDto.fromEntity(request);
    }

    /**
     * Processes an approval or rejection decision for a recruitment request.
     *
     * @param requestId         The ID of the request to process.
     * @param decision          The decision, either "APPROVE" or "REJECT".
     * @param remark            A comment from the approver.
     * @param approvedBy        The ID or name of the approver.
     * @param advertisementType The type of advertisement ("Inside" or "Outside"),
     *                          required for approval.
     * @return The updated RecruitmentRequest entity.
     */
    @Transactional
    public RecruitmentRequest processApproval(Long requestId, String decision, String remark, String approvedBy,
            String advertisementType) {
        RecruitmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + requestId));

        if ("APPROVE".equalsIgnoreCase(decision)) {
            request.setRequestStatus("APPROVED");
            // Add validation and set the advertisement type only on approval
            if (advertisementType == null || advertisementType.trim().isEmpty()) {
                throw new IllegalArgumentException("Advertisement Type is required for approval.");
            }
            request.setAdvertisementType(advertisementType);
        } else {
            request.setRequestStatus("REJECTED");
        }

        request.setGmRemark(remark);
        request.setApprovedBy(approvedBy);
        request.setGmApprovedDate(String.valueOf(LocalDate.now()));
        request.setUpdatedDate(String.valueOf(LocalDate.now()));

        return requestRepository.save(request);
    }

    @Transactional
    public void deleteRequest(Long id) {
        if (!requestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Recruitment Request not found with ID: " + id);
        }
        requestRepository.deleteById(id);
    }
}