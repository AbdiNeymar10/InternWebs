package com.example.employee_management.repository;

import com.example.employee_management.entity.HRFieldOfStudy;
import com.example.employee_management.entity.FieldOf_Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface HRFieldOfStudyRepository extends JpaRepository<HRFieldOfStudy, Long> {
    List<HRFieldOfStudy> findByJobQualificationId(Long jobQualificationId);

    @Transactional
    void deleteByJobQualificationId(Long jobQualificationId);

    FieldOf_Study findByFieldOfStudy_Name(String name);
}
