package com.example.employee_management.controller;

import com.example.employee_management.dto.FullJobDetailsResponseDto;
import com.example.employee_management.dto.RecruitmentJobCodeBatchDto;
import com.example.employee_management.entity.RecruitmentRequesttwo;
import com.example.employee_management.service.RecruitmentServicetwo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruitmenttwo")
public class RecruitmentControllertwo {

    @Autowired
    private RecruitmentServicetwo recruitmentServicetwo;

    @PostMapping("/request")
    public ResponseEntity<?> createRecruitmentRequest(@RequestBody RecruitmentRequesttwo request) {
        try {
            RecruitmentRequesttwo createdRequest = recruitmentServicetwo.createRequest(request);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<RecruitmentRequesttwo>> getPendingRequests() {
        List<RecruitmentRequesttwo> requests = recruitmentServicetwo.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    @GetMapping("/job-details")
    public ResponseEntity<List<FullJobDetailsResponseDto>> getJobDetailsByTitle(@RequestParam Long jobTitleId) {
        List<FullJobDetailsResponseDto> details = recruitmentServicetwo.getFullJobDetailsByJobTitle(jobTitleId);
        return ResponseEntity.ok(details);
    }

    @PostMapping("/approve")
    public ResponseEntity<?> processApproval(
            @RequestBody Map<String, Object> payload) {
        try {
            Long requestId = Long.parseLong(payload.get("recruitRequestId").toString());
            String decision = (String) payload.get("decision");
            String remark = (String) payload.get("remark");
            String approvedBy = (String) payload.get("approvedBy");

            RecruitmentRequesttwo request = recruitmentServicetwo.processApproval(
                    requestId, decision, remark, approvedBy);

            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/request/{id}")
    public ResponseEntity<?> updateRecruitmentRequest(
            @PathVariable Long id,
            @RequestBody RecruitmentRequesttwo requestDetails) {
        try {
            RecruitmentRequesttwo updatedRequest = recruitmentServicetwo.updateRequest(id, requestDetails);
            return ResponseEntity.ok(updatedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/request/{id}")
    public ResponseEntity<?> deleteRecruitmentRequest(@PathVariable Long id) {
        try {
            recruitmentServicetwo.deleteRequest(id);
            return ResponseEntity.ok(Map.of("message", "Recruitment request deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/jobcodes-batchcodes")
    public ResponseEntity<List<RecruitmentJobCodeBatchDto>> getJobCodesAndBatchCodes(
            @RequestParam(required = false) String advertisementType) {
        List<RecruitmentJobCodeBatchDto> results = recruitmentServicetwo.getJobCodesAndBatchCodesByAdvertisementType(advertisementType);
        return ResponseEntity.ok(results);
    }

}