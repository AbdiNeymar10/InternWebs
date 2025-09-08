package com.example.employee_management.controller;

import com.example.employee_management.dto.RecruitmentRequestDisplayDto;
import com.example.employee_management.entity.RecruitmentRequest;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.service.RecruitmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recruitment")
public class RecruitmentController {

    @Autowired
    private RecruitmentService recruitmentService;

    @PostMapping("/request")
    public ResponseEntity<?> createRecruitmentRequest(@RequestBody RecruitmentRequest request) {
        try {
            RecruitmentRequest createdRequest = recruitmentService.createRequest(request);
            return ResponseEntity.ok(createdRequest);
        } catch (IllegalArgumentException | ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @PutMapping("/request/{id}")
    public ResponseEntity<?> updateRecruitmentRequest(@PathVariable("id") Long id, @RequestBody RecruitmentRequest request) {
        try {
            if (request.getRecruitRequestId() == null || !id.equals(request.getRecruitRequestId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Request ID in path does not match ID in body or is missing."));
            }
            RecruitmentRequest updatedRequest = recruitmentService.updateRequest(request);
            return ResponseEntity.ok(updatedRequest);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/request/{id}")
    public ResponseEntity<?> deleteRecruitmentRequest(@PathVariable("id") Long id) {
        try {
            recruitmentService.deleteRequest(id);
            return ResponseEntity.ok(Map.of("message", "Recruitment request deleted successfully."));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error deleting request: " + e.getMessage()));
        }
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<RecruitmentRequest>> getPendingRequests() {
        List<RecruitmentRequest> requests = recruitmentService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/pending-requests-for-edit")
    @Transactional(readOnly = true) // Transactional context for DTO conversion
    public ResponseEntity<List<RecruitmentRequestDisplayDto>> getPendingRequestsForEdit() {
        List<RecruitmentRequest> requests = recruitmentService.getPendingRequests();
        List<RecruitmentRequestDisplayDto> dtos = requests.stream()
                .map(RecruitmentRequestDisplayDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<RecruitmentRequestDisplayDto> getRecruitmentRequestById(@PathVariable("id") Long id) {
        RecruitmentRequestDisplayDto requestDto = recruitmentService.getRecruitmentRequestById(id);
        return ResponseEntity.ok(requestDto);
    }

    @PostMapping("/approve")
    public ResponseEntity<?> processApproval(@RequestBody Map<String, Object> payload) {
        try {
            Long requestId = Long.parseLong(payload.get("recruitRequestId").toString());
            String decision = (String) payload.get("decision");
            String remark = (String) payload.get("remark");
            String approvedBy = (String) payload.get("approvedBy");
            // MODIFIED: Get the new field from the payload
            String advertisementType = (String) payload.get("advertisementType");

            // MODIFIED: Pass the new field to the service
            RecruitmentRequest request = recruitmentService.processApproval(
                    requestId, decision, remark, approvedBy, advertisementType);

            return ResponseEntity.ok(request);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) { // Catch validation errors from the service
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}