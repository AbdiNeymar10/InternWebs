package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    // Custom query to find departments by level
    List<Department> findByDeptLevel(Long deptLevel);

    // The following CRUD methods are inherited from JpaRepository:
    // - save(Department entity) --> for create & update
    // - findById(Long id) --> for read
    // - findAll() --> for list all
    // - deleteById(Long id) --> for delete
}
