package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HRDeptJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HRDeptJobRepository extends JpaRepository<HRDeptJob, Long> {

List<HRDeptJob> findByDepartment_DeptId(Long deptId);
}