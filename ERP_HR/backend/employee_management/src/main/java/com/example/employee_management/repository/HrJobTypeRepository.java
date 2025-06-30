package com.example.employee_management.repository;

import com.example.employee_management.entity.HrJobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
// import java.util.Optional;

@Repository
public interface HrJobTypeRepository extends JpaRepository<HrJobType, Long> {
    List<HrJobType> findByJobTitle_Id(Long jobTitleId);

}