package com.example.employee_management.controller;

import com.example.employee_management.entity.SeparationFileUpload;
import com.example.employee_management.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/upload-separation-supportive-doc")
    public ResponseEntity<Map<String, String>> uploadSeparationSupportiveDoc(
            @RequestParam("file") MultipartFile file,
            @RequestParam(name = "separationId", required = false) String separationId) {
        logger.info("Received file upload request for separationId: {}", separationId);
        try {
            SeparationFileUpload savedFile = fileUploadService.storeSeparationSupportiveDoc(file, separationId);
            Map<String, String> response = new HashMap<>();
            response.put("uploadId", String.valueOf(savedFile.getUploadId()));
            response.put("fileName", savedFile.getFileName());
            response.put("fileType", savedFile.getFileType());
            if (savedFile.getSeparationId() != null) {
                response.put("separationId", savedFile.getSeparationId());
            }
            logger.info("File uploaded successfully: {}", savedFile.getFileName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            logger.error("Could not upload file: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Could not upload the file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error during file upload: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "An unexpected error occurred during file upload.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Endpoint to download a file by its UPLOAD_ID
    @GetMapping("/download/{uploadId}")
    public ResponseEntity<byte[]> downloadFileByUploadId(@PathVariable String uploadId) {
        logger.info("Received request to download file with UPLOAD_ID: {}", uploadId);
        SeparationFileUpload fileUpload = fileUploadService.getFileByUploadId(uploadId);

        if (fileUpload == null || fileUpload.getUploadFile() == null) {
            logger.warn("File not found with UPLOAD_ID: {}", uploadId);
            return ResponseEntity.notFound().build();
        }

        logger.info("Sending file for download: {}", fileUpload.getFileName());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileUpload.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileUpload.getFileName() + "\"")
                .body(fileUpload.getUploadFile());
    }

    // Endpoint to get file metadata by separationId (useful for listing files on
    // approval pages)
    @GetMapping("/info/separation/{separationId}")
    public ResponseEntity<List<SeparationFileUpload>> getFilesInfoBySeparationId(@PathVariable String separationId) {
        logger.info("Received request for file info by separationId: {}", separationId);
        List<SeparationFileUpload> files = fileUploadService.getFilesBySeparationId(separationId);
        if (files.isEmpty()) {
            // It's okay if no files are associated, return an empty list rather than 404
            logger.info("No files found for separationId: {}", separationId);
        }
        return ResponseEntity.ok(files);
    }
}