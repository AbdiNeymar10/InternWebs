package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Long> {
    // Check if a job type with the given code exists
    boolean existsByCode(String code);
}