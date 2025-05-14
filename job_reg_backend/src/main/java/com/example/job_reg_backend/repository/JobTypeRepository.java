package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
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
}
