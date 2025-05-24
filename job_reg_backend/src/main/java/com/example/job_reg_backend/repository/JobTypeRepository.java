package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Long> {
    // Check if a job type with the given code exists
    boolean existsByCode(String code);
    
    @Query("SELECT DISTINCT jt.jobTitle FROM JobType jt")
    List<String> findAllJobTitles();

    // Custom query to find a JobType by job title
    Optional<JobType> findByJobTitle(String jobTitle);

    @Query(value = "SELECT MAX(TO_NUMBER(code)) FROM HR_LU_JOB_TYPE WHERE REGEXP_LIKE(code, '^[0-9]+$')", nativeQuery = true)
    Integer findMaxCodeAsInt();
}
