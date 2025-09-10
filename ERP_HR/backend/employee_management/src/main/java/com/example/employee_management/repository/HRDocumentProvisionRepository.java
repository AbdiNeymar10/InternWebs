package com.example.employee_management.repository;

import com.example.employee_management.entity.HRDocumentProvision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HRDocumentProvisionRepository extends JpaRepository<HRDocumentProvision, Long> {
    List<HRDocumentProvision> findByWorkId(String workId);
    
    @Query("SELECT r FROM HRDocumentProvision r WHERE r.status = :status")
    List<HRDocumentProvision> findByStatus(@Param("status") String status);
    
    @Query("SELECT r FROM HRDocumentProvision r WHERE r.workId = :workId AND r.status = :status")
    List<HRDocumentProvision> findByWorkIdAndStatus(@Param("workId") String workId, @Param("status") String status);
    
    List<HRDocumentProvision> findByRequesterContainingIgnoreCase(String requester);
}