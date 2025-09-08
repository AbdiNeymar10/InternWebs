package com.example.employee_management.repository;

import com.example.employee_management.dto.FullJobDetailsResponseDto;
import com.example.employee_management.dto.RecruitmentJobCodeBatchDto;
import com.example.employee_management.entity.RecruitmentRequesttwo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing RecruitmentRequesttwo entities.
 */
@Repository
public interface RecruitmentRequestRepositorytwo extends JpaRepository<RecruitmentRequesttwo, Long> {

    /**
     * Finds all recruitment requests with a specific status.
     *
     * @param status The status to filter by (e.g., "PENDING", "APPROVED").
     * @return A list of matching recruitment requests.
     */
    List<RecruitmentRequesttwo> findByRequestStatus(String status);

    /**
     * Fetches a list of job codes and batch codes, along with their corresponding job title IDs,
     * filtered by advertisement type. Used to populate dropdowns in the frontend.
     *
     * @param advertisementType The type of advertisement to filter by. Can be null.
     * @return A list of DTOs containing the combined job title/batch code and the job title ID.
     */
    @Query("""
        SELECT new com.example.employee_management.dto.RecruitmentJobCodeBatchDto(
            CONCAT(r.jobCodeDetail.hrJobType.jobTitle.jobTitle, ' - ', r.recruitBatchCode),
            r.jobCodeDetail.hrJobType.jobTitle.id
        )
        FROM RecruitmentRequesttwo r
        WHERE (:advertisementType IS NULL OR LOWER(r.advertisementType) = LOWER(:advertisementType))
    """)
    List<RecruitmentJobCodeBatchDto> findJobCodesAndBatchCodesByAdvertisementType(@Param("advertisementType") String advertisementType);

    /**
     * Fetches detailed information for recruitment requests associated with a specific job title ID.
     * This query constructs a DTO with specific fields needed by the frontend.
     *
     * @param jobTitleId The ID of the job title to search for.
     * @return A list of DTOs containing the full job details.
     */
    @Query("""
        SELECT new com.example.employee_management.dto.FullJobDetailsResponseDto(
            rr.icf.icf,
            rr.department.depName,
            rr.recruitBatchCode,
            rr.numOfEmps
        )
        FROM RecruitmentRequesttwo rr
        JOIN rr.jobCodeDetail hjd
        WHERE hjd.hrJobType.jobTitle.id = :jobTitleId
    """)
    List<FullJobDetailsResponseDto> findFullJobDetailsByJobTitleId(@Param("jobTitleId") Long jobTitleId);
}