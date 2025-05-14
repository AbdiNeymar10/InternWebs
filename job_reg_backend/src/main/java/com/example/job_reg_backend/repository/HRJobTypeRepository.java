package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.model.JobType; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HRJobTypeRepository extends JpaRepository<HRJobType, Long> {

    // Custom query to fetch the last job code for a given Job Title ID
    @Query("SELECT j.jobCode FROM HRJobType j WHERE j.jobTitle.id = :jobTitleId ORDER BY j.jobCode DESC LIMIT 1")
    String findLastJobCodeByJobTitleId(@Param("jobTitleId") Long jobTitleId);

    // Custom query to find job type by job title
    Optional<HRJobType> findByJobTitle_JobTitle(String jobTitle);

    @Query("SELECT h FROM HRJobType h WHERE h.jobTitle.id IN :jobTitleIds")
    List<HRJobType> findByJobTitleIds(@Param("jobTitleIds") List<Long> jobTitleIds);

    @Query("SELECT h FROM HRJobType h WHERE h.jobTitle.id = :jobTitleId")
    Optional<HRJobType> findByJobTitleId(@Param("jobTitleId") Long jobTitleId);

    // Add the missing findByJobTitle method
    @Query("SELECT h FROM HRJobType h WHERE h.jobTitle = :jobTitle")
    Optional<HRJobType> findByJobTitle(@Param("jobTitle") JobType jobTitle);
}