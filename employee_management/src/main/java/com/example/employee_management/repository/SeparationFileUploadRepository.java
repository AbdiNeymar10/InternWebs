package com.example.employee_management.repository;

import com.example.employee_management.entity.SeparationFileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeparationFileUploadRepository extends JpaRepository<SeparationFileUpload, String> {
    Optional<SeparationFileUpload> findByFileName(String fileName);
    List<SeparationFileUpload> findBySeparationId(String separationId);
}