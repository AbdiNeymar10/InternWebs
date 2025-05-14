package com.example.job_reg_backend.service;

import com.example.job_reg_backend.dto.DepartmentDto;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDto> getAllDepartments();

    List<DepartmentDto> getDepartmentsByDeptLevel(Long deptLevel);

    DepartmentDto createDepartment(DepartmentDto dto);

    DepartmentDto updateDepartment(DepartmentDto dto);

    void deleteDepartment(Long id);
}
