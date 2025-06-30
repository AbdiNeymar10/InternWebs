package com.example.employee_management.repository;

import com.example.employee_management.entity.HrJobTypeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HrJobTypeDetailRepository extends JpaRepository<HrJobTypeDetail, Long> {

    // Method to find records by JOB_TYPE_ID
    List<HrJobTypeDetail> findByJobTypeId(Long jobTypeId);

    // Keep the old one for now if other parts of the app use it,
    // but it's not used in the new job title logic path.
    // Optional<HrJobTypeDetail> findByIdAndJobTypeId(Long id, Long jobTypeId);
}