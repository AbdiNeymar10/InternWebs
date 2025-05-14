package com.example.job_reg_backend.service.impl;

import com.example.job_reg_backend.dto.DepartmentDto;
import com.example.job_reg_backend.model.Department;
import com.example.job_reg_backend.repository.DepartmentRepository;
import com.example.job_reg_backend.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    /**
     * Returns all departments from the repository as DepartmentDto objects.
     */
    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(DepartmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Returns departments filtered by deptLevel as DepartmentDto objects.
     */
    @Override
    public List<DepartmentDto> getDepartmentsByDeptLevel(Long deptLevel) {
        return departmentRepository.findByDeptLevel(deptLevel)
                .stream()
                .map(DepartmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new Department from DepartmentDto and returns the saved
     * DepartmentDto.
     */
    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {
        Department dept = new Department();
        copyDtoToEntity(dto, dept);
        Department saved = departmentRepository.save(dept);
        return DepartmentDto.fromEntity(saved);
    }

    /**
     * Updates an existing Department based on DepartmentDto and returns the updated
     * DepartmentDto.
     */
    @Override
    public DepartmentDto updateDepartment(DepartmentDto dto) {
        Optional<Department> optional = departmentRepository.findById(dto.getDeptId());
        if (optional.isEmpty()) {
            throw new RuntimeException("Department not found with id: " + dto.getDeptId());
        }
        Department dept = optional.get();
        copyDtoToEntity(dto, dept);
        Department updated = departmentRepository.save(dept);
        return DepartmentDto.fromEntity(updated);
    }

    /**
     * Deletes a Department by ID.
     */
    @Override
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }

    /**
     * Copies values from DepartmentDto to Department entity.
     */
    private void copyDtoToEntity(DepartmentDto dto, Department dept) {
        dept.setDepName(dto.getDeptName());
        dept.setDeptLevel(dto.getDeptLevel());
        dept.setEmail(dto.getEmail());
        dept.setEstDate(dto.getEstDate());
        dept.setMission(dto.getMission());
        dept.setVision(dto.getVision());
        dept.setPoBox(dto.getPoBox());
        dept.setStatus(dto.getStatus() != null ? Long.parseLong(dto.getStatus()) : null);
        dept.setTele1(dto.getTele1());
        dept.setTele2(dto.getTele2());
    }
}
