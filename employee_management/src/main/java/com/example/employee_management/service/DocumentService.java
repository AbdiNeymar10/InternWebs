package com.example.employee_management.service;

import com.example.employee_management.entity.Document;
import com.example.employee_management.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public Document uploadFile(MultipartFile file, String category, String description) throws IOException {
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String fileId = UUID.randomUUID().toString();
        String fileName = file.getOriginalFilename();
        String filePath = Paths.get(uploadDir, fileId + "_" + fileName).toString();

        Files.createDirectories(Paths.get(uploadDir));
        file.transferTo(new File(filePath));

        Document document = new Document(
            fileId,
            fileName,
            file.getSize(),
            file.getContentType(),
            category,
            description,
            LocalDateTime.now(),
            filePath
        );
        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(String id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    public void deleteDocument(String id) throws IOException {
        Document document = getDocumentById(id);
        Files.deleteIfExists(Paths.get(document.getFilePath()));
        documentRepository.deleteById(id);
    }

    public Document updateDocument(String id, String category, String description) {
        Document document = getDocumentById(id);
        document.setCategory(category);
        document.setDescription(description);
        return documentRepository.save(document);
    }

    public File getFile(String id) {
        Document document = getDocumentById(id);
        File file = new File(document.getFilePath());
        if (!file.exists()) {
            throw new IllegalArgumentException("File not found on server");
        }
        return file;
    }
}