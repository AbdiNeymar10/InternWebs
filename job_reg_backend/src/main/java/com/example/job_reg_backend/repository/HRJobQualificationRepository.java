package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRJobQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HRJobQualificationRepository extends JpaRepository<HRJobQualification, Long> {
    // Custom query to find qualification by qualification name
    Optional<HRJobQualification> findByQualification(String qualification);
}


