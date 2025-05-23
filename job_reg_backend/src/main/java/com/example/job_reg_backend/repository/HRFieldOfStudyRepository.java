package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRFieldOfStudy;
import com.example.job_reg_backend.model.FieldOfStudy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface HRFieldOfStudyRepository extends JpaRepository<HRFieldOfStudy, Long> {
    List<HRFieldOfStudy> findByJobQualificationId(Long jobQualificationId);

    @Transactional
    void deleteByJobQualificationId(Long jobQualificationId);

    FieldOfStudy findByFieldOfStudy_Name(String name);
}
