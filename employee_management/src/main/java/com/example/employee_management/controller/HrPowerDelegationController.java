package com.example.employee_management.controller;

import com.example.employee_management.entity.HrPowerDelegation;
import com.example.employee_management.service.HrPowerDelegationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths; // Changed from java.nio.file.Path to java.nio.file.Paths
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-power-delegation")
public class HrPowerDelegationController {

    @Autowired
    private HrPowerDelegationService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${file.upload-dir:/uploads/delegations}")
    private String uploadDirectory;

    @GetMapping
    public List<HrPowerDelegation> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrPowerDelegation> getById(@PathVariable Long id) {
        Optional<HrPowerDelegation> delegation = service.findById(id);
        return delegation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/delegator/{delegatorId}")
    public List<HrPowerDelegation> getByDelegatorId(@PathVariable String delegatorId) {
        return service.findByDelegatorId(delegatorId);
    }

    @GetMapping("/delegatee/{delegateeId}")
    public List<HrPowerDelegation> getByDelegateeId(@PathVariable String delegateeId) {
        return service.findByDelegateeId(delegateeId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> create(
            @RequestPart("delegation") String delegationJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            HrPowerDelegation delegation = objectMapper.readValue(delegationJson, HrPowerDelegation.class);
            if (file != null && !file.isEmpty()) {
                String filePath = saveFile(file);
                delegation.setDoctRete(filePath.length() > 45 ? filePath.substring(0, 45) : filePath);
            } else {
                System.out.println("No file uploaded or file is empty");
            }
            HrPowerDelegation savedDelegation = service.save(delegation);
            Map<String, Object> response = new HashMap<>();
            response.put("data", savedDelegation);
            response.put("message", "Delegation created successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "File upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Unexpected error in create: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id,
            @RequestPart("delegation") String delegationJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Optional<HrPowerDelegation> existingDelegation = service.findById(id);
            if (!existingDelegation.isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Delegation not found for ID: " + id);
                return ResponseEntity.status(404).body(errorResponse);
            }
            HrPowerDelegation delegation = objectMapper.readValue(delegationJson, HrPowerDelegation.class);
            HrPowerDelegation current = existingDelegation.get();

            // Update fields
            current.setStatus(delegation.getStatus());
            current.setUpdatedBy(delegation.getUpdatedBy());
            current.setUpdatedDate(delegation.getUpdatedDate());
            current.setUpdatorRemark(delegation.getUpdatorRemark());
            current.setFromDate(delegation.getFromDate());
            current.setToDate(delegation.getToDate());
            current.setRequestDate(delegation.getRequestDate());
            current.setRequesterNotice(delegation.getRequesterNotice());
            current.setDelegateeId(delegation.getDelegateeId());
            current.setDelegatorId(delegation.getDelegatorId());

            // Handle file update
            if (file != null && !file.isEmpty()) {
                String filePath = saveFile(file);
                current.setDoctRete(filePath.length() > 45 ? filePath.substring(0, 45) : filePath);
            } else {
                System.out.println("No file uploaded or file is empty");
            }

            HrPowerDelegation updatedDelegation = service.save(current);
            Map<String, Object> response = new HashMap<>();
            response.put("data", updatedDelegation);
            response.put("message", "Delegation updated successfully");
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            System.err.println("File upload error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "File upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Unexpected error in update: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private String saveFile(MultipartFile file) throws IOException {
        // 1. Use Paths.get to construct the directory Path
        Path directory = Paths.get(uploadDirectory);

        // 2. Return relative path to the file instead of just the filename
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
            System.out.println("Created directory: " + directory.toAbsolutePath());
        }
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = System.currentTimeMillis() + "_" + originalFilename;
        Path filePath = directory.resolve(uniqueFilename);
        System.out.println("Saving file to: " + filePath.toAbsolutePath());
        file.transferTo(filePath.toFile());

        // Changed to return the relative path from the upload directory
        return directory.relativize(filePath).toString().length() > 45 ? directory.relativize(filePath).toString().substring(0, 45) : directory.relativize(filePath).toString();
    }
}