package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HrLuDocumentTypeRepository extends JpaRepository<HrLuDocumentType, Long> {
    @Query("SELECT t FROM HrLuDocumentType t WHERE t.isActive = 'Y'")
    List<HrLuDocumentType> findAllActive();
    
    HrLuDocumentType findByName(String name);
    
    @Query("SELECT t FROM HrLuDocumentType t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<HrLuDocumentType> findByNameContainingIgnoreCase(@Param("name") String name);
}