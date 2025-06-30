package com.example.employee_management.repository;

import com.example.employee_management.entity.HRJob_Type;
import com.example.employee_management.entity.Job_Type; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HRJob_TypeRepository extends JpaRepository<HRJob_Type, Long> {

    // Custom query to fetch the last job code for a given Job Title ID
    @Query("SELECT j.jobCode FROM HRJob_Type j WHERE j.jobTitle.id = :jobTitleId ORDER BY j.jobCode DESC LIMIT 1")
    String findLastJobCodeByJobTitleId(@Param("jobTitleId") Long jobTitleId);

    // Custom query to find job type by job title
    Optional<HRJob_Type> findByJobTitle_JobTitle(String jobTitle);

    @Query("SELECT h FROM HRJob_Type h WHERE h.jobTitle.id IN :jobTitleIds")
    List<HRJob_Type> findByJobTitleIds(@Param("jobTitleIds") List<Long> jobTitleIds);

    @Query("SELECT h FROM HRJob_Type h WHERE h.jobTitle.id = :jobTitleId")
    Optional<HRJob_Type> findByJobTitleId(@Param("jobTitleId") Long jobTitleId);

    // Add the missing findByJobTitle method
    @Query("SELECT h FROM HRJob_Type h WHERE h.jobTitle = :jobTitle")
    Optional<HRJob_Type> findByJobTitle(@Param("jobTitle") Job_Type jobTitle);

    List<HRJob_Type> findByJobFamily(Long jobFamilyId);

    List<HRJob_Type> findByJobFamilyAndJobTitle_Id(Long jobFamily, Long jobTitleId);
    List<HRJob_Type> findByJobTitle_IdAndJobFamilyIsNull(Long jobTitleId);
    List<HRJob_Type> findByJobTitle_Id(Long jobTitleId);
}