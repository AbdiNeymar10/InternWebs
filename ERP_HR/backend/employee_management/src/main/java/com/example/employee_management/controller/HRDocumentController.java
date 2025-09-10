package com.example.employee_management.controller;

import com.example.employee_management.entity.HRDocumentProvision;
import com.example.employee_management.entity.HrLuDocumentType;
import com.example.employee_management.service.FileStorageService;
import com.example.employee_management.service.HRDocumentProvisionService;
import com.example.employee_management.service.HrLuDocumentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hrdocument")
public class HRDocumentController {

    @Autowired
    private HRDocumentProvisionService provisionService;

    @Autowired
    private HrLuDocumentTypeService luDocumentTypeService;

    @Autowired
    private FileStorageService fileStorageService;

    // Document request with file upload
    @PostMapping(value = "/request", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HRDocumentProvision createRequest(
            @RequestParam("workId") String workId,
            @RequestParam("documentTypeId") Long documentTypeId,
            @RequestParam("remark") String remark,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        HRDocumentProvision request = new HRDocumentProvision();
        request.setWorkId(workId);
        request.setRequester("Employee " + workId);
        request.setRemark(remark);
        request.setStatus("PENDING");
        request.setRequestedDate(LocalDateTime.now().toString());
        request.setReferenceNo("REF-" + workId + "-" + System.currentTimeMillis());

        // Set document type
        HrLuDocumentType documentType = luDocumentTypeService.getDocumentTypeById(documentTypeId)
                .orElseThrow(() -> new RuntimeException("Document type not found"));
        request.setDocumentType(documentType);

        // Save request first to get ID
        HRDocumentProvision savedRequest = provisionService.saveRequest(request);

        // Handle file upload after saving to get the ID
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file, savedRequest.getId());
            savedRequest.setAttachmentName(file.getOriginalFilename());
            savedRequest.setAttachmentPath(fileName);
            return provisionService.saveRequest(savedRequest);
        }

        return savedRequest;
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
        HRDocumentProvision request = provisionService.getRequestById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        request.setStatus("APPROVED");
        request.setApproveDate(approvalDetails.getApproveDate());
        request.setApprovedRefNo(approvalDetails.getApprovedRefNo());
        return provisionService.saveRequest(request);
    }

    // Reject a request
    @PutMapping("/reject/{id}")
    public HRDocumentProvision rejectRequest(@PathVariable Long id, @RequestBody HRDocumentProvision rejectionDetails) {
        HRDocumentProvision request = provisionService.getRequestById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        request.setStatus("REJECTED");
        request.setDroperRemark(rejectionDetails.getDroperRemark());
        request.setDroppedDate(rejectionDetails.getDroppedDate());
        request.setDroppedBy(rejectionDetails.getDroppedBy());
        return provisionService.saveRequest(request);
    }

    // Get requests by employee ID
    @GetMapping("/employee/{workId}")
    public List<HRDocumentProvision> getRequestsByEmployee(@PathVariable String workId) {
        return provisionService.getRequestsByWorkId(workId);
    }

    // Download file endpoint
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        // Load file as Resource
        byte[] fileContent = fileStorageService.loadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(fileContent);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    // View file endpoint (inline)
    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) throws IOException {
        byte[] fileContent = fileStorageService.loadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(fileContent);

        String contentType = Files.probeContentType(Paths.get(fileName));
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    // Get file info for a request
    @GetMapping("/{id}/file-info")
    public ResponseEntity<?> getFileInfo(@PathVariable Long id) {
        Optional<HRDocumentProvision> request = provisionService.getRequestById(id);
        if (request.isPresent() && request.get().getAttachmentPath() != null) {
            FileInfoResponse response = new FileInfoResponse(
                request.get().getAttachmentName(),
                request.get().getAttachmentPath(),
                fileStorageService.getFileDownloadUrl(request.get().getAttachmentPath()),
                fileStorageService.getFileViewUrl(request.get().getAttachmentPath())
            );
            return ResponseEntity.ok().body(response);
        }
        return ResponseEntity.notFound().build();
    }

    // Inner class for file info response
    public static class FileInfoResponse {
        private String originalName;
        private String storedName;
        private String downloadUrl;
        private String viewUrl;

        public FileInfoResponse(String originalName, String storedName, String downloadUrl, String viewUrl) {
            this.originalName = originalName;
            this.storedName = storedName;
            this.downloadUrl = downloadUrl;
            this.viewUrl = viewUrl;
        }

        // Getters and setters
        public String getOriginalName() { return originalName; }
        public void setOriginalName(String originalName) { this.originalName = originalName; }
        public String getStoredName() { return storedName; }
        public void setStoredName(String storedName) { this.storedName = storedName; }
        public String getDownloadUrl() { return downloadUrl; }
        public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
        public String getViewUrl() { return viewUrl; }
        public void setViewUrl(String viewUrl) { this.viewUrl = viewUrl; }
    }
}