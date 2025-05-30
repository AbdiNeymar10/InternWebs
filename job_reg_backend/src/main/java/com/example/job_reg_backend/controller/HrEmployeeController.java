package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.dto.EmployeeInfoDto;
import com.example.job_reg_backend.dto.EmployeeWithPayGradeDto;
import com.example.job_reg_backend.model.HrEmployee;
import com.example.job_reg_backend.service.HrEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class HrEmployeeController {

    private final HrEmployeeService hrEmployeeService;

    @Autowired
    public HrEmployeeController(HrEmployeeService hrEmployeeService) {
        this.hrEmployeeService = hrEmployeeService;
    }


    @GetMapping
    public List<HrEmployee> getAllEmployees() {
        return hrEmployeeService.getAllEmployees();
    }

    @GetMapping("/{empId}")
    public ResponseEntity<HrEmployee> getEmployeeById(@PathVariable String empId) {
        return ResponseEntity.ok(hrEmployeeService.getEmployeeById(empId));
    }

    @GetMapping("/{empId}/with-relations")
    public ResponseEntity<HrEmployee> getEmployeeWithRelations(@PathVariable String empId) {
        return ResponseEntity.ok(hrEmployeeService.getEmployeeWithRelations(empId));
    }
    // In HrEmployeeController.java

    @GetMapping("/{empId}/with-pay-grade")
    public ResponseEntity<HrEmployee> getEmployeeWithPayGrade(@PathVariable String empId) {
        return ResponseEntity.ok(hrEmployeeService.getEmployeeWithPayGrade(empId));
    }
    // In HrEmployeeController.java

    @GetMapping("/{empId}/pay-grade-info")
    public ResponseEntity<EmployeeWithPayGradeDto> getEmployeePayGradeInfo(@PathVariable String empId) {
        HrEmployee employee = hrEmployeeService.getEmployeeWithPayGrade(empId);
        return ResponseEntity.ok(new EmployeeWithPayGradeDto(employee));
    }

    @GetMapping("/{empId}/info")
    public ResponseEntity<EmployeeInfoDto> getEmployeeInfo(@PathVariable String empId) {
        return ResponseEntity.ok(hrEmployeeService.getEmployeeInfo(empId));
    }

    @PostMapping
    public ResponseEntity<HrEmployee> createEmployee(@RequestBody HrEmployee employee) {
        return ResponseEntity.ok(hrEmployeeService.createEmployee(employee));
    }


    @PutMapping("/{empId}")
    public ResponseEntity<HrEmployee> updateEmployee(
            @PathVariable String empId,
            @RequestBody HrEmployee employeeDetails) {
        return ResponseEntity.ok(hrEmployeeService.updateEmployee(empId, employeeDetails));
    }

    @DeleteMapping("/{empId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String empId) {
        hrEmployeeService.deleteEmployee(empId);
        return ResponseEntity.noContent().build();
    }
}