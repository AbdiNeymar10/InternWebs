package com.example.employee_management.service;

import com.example.employee_management.entity.SeparationFileUpload;
import com.example.employee_management.repository.SeparationFileUploadRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Autowired
    private SeparationFileUploadRepository separationFileUploadRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public SeparationFileUpload storeSeparationSupportiveDoc(MultipartFile file, String separationId)
            throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        logger.info("Attempting to store file: {} for separationId: {}", originalFileName, separationId);

        if (originalFileName.contains("..")) {
            throw new IOException("Filename contains invalid path sequence " + originalFileName);
        }

        Long newUploadId;
        try {
            // Get sequence value and convert to Long
            BigDecimal sequenceValue = (BigDecimal) entityManager
                    .createNativeQuery("SELECT SEPARATION_FILE_UPLOAD_SEQ.NEXTVAL FROM DUAL")
                    .getSingleResult();
            newUploadId = sequenceValue.longValue();
        } catch (Exception e) {
            logger.error("CRITICAL: Failed to get NEXTVAL from SEPARATION_FILE_UPLOAD_SEQ. Error: {}", e.getMessage(),
                    e);
            throw new RuntimeException("Could not generate file upload ID from sequence.", e);
        }

        SeparationFileUpload fileUpload = new SeparationFileUpload();
        fileUpload.setUploadId(newUploadId); // Now Long
        fileUpload.setFileName(originalFileName);
        fileUpload.setFileType(file.getContentType());
        fileUpload.setUploadFile(file.getBytes());
        if (StringUtils.hasText(separationId)) {
            fileUpload.setSeparationId(separationId); // Always String
        }

        try {
            SeparationFileUpload savedFile = separationFileUploadRepository.save(fileUpload);
            logger.info("Successfully stored file with UPLOAD_ID: {} and FileName: {}", savedFile.getUploadId(),
                    savedFile.getFileName());
            return savedFile;
        } catch (Exception e) {
            logger.error("Database error while storing file {}: {}", originalFileName, e.getMessage(), e);
            throw new IOException("Could not store file " + originalFileName + ". Please try again!", e);
        }
    }

    public SeparationFileUpload getFileByUploadId(Long uploadId) {
        return separationFileUploadRepository.findById(uploadId).orElse(null);
    }

    public SeparationFileUpload getFileByFileName(String fileName) {
        return separationFileUploadRepository.findByFileName(fileName).orElse(null);
    }

    public List<SeparationFileUpload> getFilesBySeparationId(String separationId) {
        return separationFileUploadRepository.findBySeparationId(separationId);
    }
}