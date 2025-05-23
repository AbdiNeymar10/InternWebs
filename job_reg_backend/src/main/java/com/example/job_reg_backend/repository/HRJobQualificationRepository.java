package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRJobQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HRJobQualificationRepository extends JpaRepository<HRJobQualification, Long> {
    Optional<HRJobQualification> findByQualification(String qualification);

    List<HRJobQualification> findByJobTypeId(Long jobTypeId);

     void deleteByJobTypeId(Long jobTypeId);
}


