package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRJobTypeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param; 
import com.example.job_reg_backend.model.HRLuIcf;

@Repository
public interface HRJobTypeDetailRepository extends JpaRepository<HRJobTypeDetail, Long> {
@Query("SELECT d FROM HRJobTypeDetail d WHERE d.jobType.jobTitle.jobTitle = :jobTitle AND d.jobType.jobGrade.grade = :jobClass")
List<HRJobTypeDetail> findByJobTitleAndClass(@Param("jobTitle") String jobTitle, @Param("jobClass") String jobClass);

 @Query("SELECT d.icf.icf FROM HRJobTypeDetail d")
List<String> findDistinctIcfValues();

@Query("SELECT d.icf.icf FROM HRJobTypeDetail d WHERE d.jobType.id = :jobTypeId")
List<String> findIcfValuesByJobTypeId(@Param("jobTypeId") Long jobTypeId);
}
