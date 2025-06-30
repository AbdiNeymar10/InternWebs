package com.example.employee_management.repository;

import com.example.employee_management.entity.HRDeptJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HRDeptJobRepository extends JpaRepository<HRDeptJob, Long> {

List<HRDeptJob> findByDepartment_DeptId(Long deptId);
}