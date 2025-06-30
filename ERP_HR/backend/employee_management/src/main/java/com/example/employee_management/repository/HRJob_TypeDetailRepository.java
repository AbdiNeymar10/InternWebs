package com.example.employee_management.repository;

import com.example.employee_management.entity.HRJob_TypeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param; 

@Repository
public interface HRJob_TypeDetailRepository extends JpaRepository<HRJob_TypeDetail, Long> {
@Query("SELECT d FROM HRJob_TypeDetail d WHERE d.jobType.jobTitle.jobTitle = :jobTitle AND d.jobType.jobGrade.grade = :jobClass")
List<HRJob_TypeDetail> findByJobTitleAndClass(@Param("jobTitle") String jobTitle, @Param("jobClass") String jobClass);

 @Query("SELECT d.icf.icf FROM HRJob_TypeDetail d")
List<String> findDistinctIcfValues();

@Query("SELECT d.icf.icf FROM HRJob_TypeDetail d WHERE d.jobType.id = :jobTypeId")
List<String> findIcfValuesByJobTypeId(@Param("jobTypeId") Long jobTypeId);

@Query("SELECT d FROM HRJob_TypeDetail d WHERE d.jobType.id = :jobTypeId")
List<HRJob_TypeDetail> findByJobTypeId(@Param("jobTypeId") Long jobTypeId);
}
