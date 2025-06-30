package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "file_size", nullable = false)
    private long fileSize;

    @Column(nullable = false)
    private String type;

    private String category;

    private String description;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    public Document() {}

    public Document(String id, String name, long fileSize, String type, String category, String description, LocalDateTime uploadDate, String filePath) {
        this.id = id;
        this.name = name;
        this.fileSize = fileSize;
        this.type = type;
        this.category = category;
        this.description = description;
        this.uploadDate = uploadDate;
        this.filePath = filePath;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
}