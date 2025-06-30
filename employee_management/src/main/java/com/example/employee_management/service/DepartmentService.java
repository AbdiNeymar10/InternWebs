package com.example.employee_management.service;

import com.example.employee_management.dto.DepartmentDto;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDto> getAllDepartments();

    List<DepartmentDto> getDepartmentsByDeptLevel(Long deptLevel);

    DepartmentDto createDepartment(DepartmentDto dto);

    DepartmentDto updateDepartment(DepartmentDto dto);

    void deleteDepartment(Long id);
}
