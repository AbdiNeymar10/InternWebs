package com.example.employee_management.repository;

import com.example.employee_management.entity.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobTypeRepository extends JpaRepository<JobType, Long> {
    // Check if a job type with the given code exists
    boolean existsByCode(String code);

    // Optional: Custom query to find a JobType by job title (if needed for other purposes)
    Optional<JobType> findByJobTitle(String jobTitle);

    // The findAllJobTypes() and findAllJobTypesNative() that return List<JobTypeDTO>
    // can be removed if the service layer handles DTO conversion.
    // If you keep them, ensure the constructor path in JPQL is correct:
    // @Query("SELECT new com.example.Employee.Management.dto.JobTypeDTO(j.id, j.jobTitle, j.jobTitleInAmharic, j.code, j.status, j.description) FROM JobType j ORDER BY j.jobTitle")
    // List<JobTypeDTO> findAllJobTypes();
}