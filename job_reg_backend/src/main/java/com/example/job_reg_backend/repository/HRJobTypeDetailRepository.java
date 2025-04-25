package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRJobTypeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Import for List
import org.springframework.data.jpa.repository.Query; // Import for @Query
import org.springframework.data.repository.query.Param; // Import for @Param

@Repository
public interface HRJobTypeDetailRepository extends JpaRepository<HRJobTypeDetail, Long> {
@Query("SELECT d FROM HRJobTypeDetail d WHERE d.jobType.jobTitle.jobTitle = :jobTitle AND d.jobType.jobGrade.grade = :jobClass")
List<HRJobTypeDetail> findByJobTitleAndClass(@Param("jobTitle") String jobTitle, @Param("jobClass") String jobClass);
}