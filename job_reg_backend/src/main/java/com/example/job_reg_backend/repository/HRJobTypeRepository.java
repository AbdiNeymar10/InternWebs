package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRJobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HRJobTypeRepository extends JpaRepository<HRJobType, Long> {

    // Custom query to fetch the last job code for a given Job Title ID
    @Query("SELECT j.jobCode FROM HRJobType j WHERE j.jobTitle.id = :jobTitleId ORDER BY j.jobCode DESC LIMIT 1")
    String findLastJobCodeByJobTitleId(@Param("jobTitleId") Long jobTitleId);

}
