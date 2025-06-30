package com.example.employee_management.controller;

import com.example.employee_management.entity.HRDocumentProvision;
import com.example.employee_management.entity.HrLuDocumentType;
import com.example.employee_management.service.HRDocumentProvisionService;
import com.example.employee_management.service.HrLuDocumentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hrdocument")
public class HRDocumentController {
    @Autowired
    private HRDocumentProvisionService provisionService;
    @Autowired
    private HrLuDocumentTypeService luDocumentTypeService;

    // Endpoint for document request page
    @PostMapping("/request")
    public HRDocumentProvision createRequest(@RequestBody HRDocumentProvision request) {
        request.setStatus("PENDING"); // Set initial status
        return provisionService.saveRequest(request); // All requests routed to approval
    }

    // Endpoint for approval page
    @GetMapping("/approval")
    public List<HRDocumentProvision> getAllRequestsForApproval() {
        return provisionService.getAllRequests();
    }

    // Get all document types for dropdowns or selection
    @GetMapping("/document-types")
    public List<HrLuDocumentType> getDocumentTypes() {
        return luDocumentTypeService.getAllDocumentTypes();
    }

    // Approve a request
    @PutMapping("/approve/{id}")
    public HRDocumentProvision approveRequest(@PathVariable Long id, @RequestBody HRDocumentProvision approvalDetails) {
        HRDocumentProvision request = provisionService.getAllRequests().stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("APPROVED");
        request.setApproveDate(approvalDetails.getApproveDate());
        request.setApprovedRefNo(approvalDetails.getApprovedRefNo());
        return provisionService.saveRequest(request);
    }
}