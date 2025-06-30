package com.example.employee_management.controller;

import com.example.employee_management.dto.DepartmentDto;
//import com.example.employee_management.entity.Department;
import com.example.employee_management.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getDepartments() {
        List<DepartmentDto> depts = departmentService.getAllDepartments();
        List<DepartmentDto> unique = depts.stream()
                .collect(Collectors.toMap(DepartmentDto::getDeptId, dto -> dto, (a, b) -> a))
                .values().stream().collect(Collectors.toList());
        return ResponseEntity.ok(unique);
    }

    @GetMapping("/children/{deptLevel}")
    public ResponseEntity<List<DepartmentDto>> getByDeptLevel(
            @PathVariable("deptLevel") Long deptLevel) {
        List<DepartmentDto> children = departmentService.getDepartmentsByDeptLevel(deptLevel);
        List<DepartmentDto> uniqueChildren = children.stream()
                .collect(Collectors.toMap(DepartmentDto::getDeptId, dto -> dto, (a, b) -> a))
                .values().stream().collect(Collectors.toList());
        return ResponseEntity.ok(uniqueChildren);
    }

    // CREATE a new department
    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody DepartmentDto departmentDto) {
        DepartmentDto created = departmentService.createDepartment(departmentDto);
        return ResponseEntity.ok(created);
    }

    // UPDATE an existing department
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(
            @PathVariable("id") Long id,
            @RequestBody DepartmentDto departmentDto) {
        departmentDto.setDeptId(id); // ensure ID is set
        DepartmentDto updated = departmentService.updateDepartment(departmentDto);
        return ResponseEntity.ok(updated);
    }

    // DELETE a department by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable("id") Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
