package com.example.employee_management.repository;

import com.example.employee_management.entity.Job_Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

@Repository
public interface Job_TypeRepository extends JpaRepository<Job_Type, Long> {
    boolean existsByCode(String code);
    
    @Query("SELECT DISTINCT jt.jobTitle FROM Job_Type jt")
    List<String> findAllJobTitles();

    // Custom query to find a JobType by job title
    Optional<Job_Type> findByJobTitle(String jobTitle);

    @Query(value = "SELECT MAX(TO_NUMBER(code)) FROM HR_LU_JOB_TYPE WHERE REGEXP_LIKE(code, '^[0-9]+$')", nativeQuery = true)
    Integer findMaxCodeAsInt();
}
