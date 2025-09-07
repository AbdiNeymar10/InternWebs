package com.example.employee_management.controller;

import com.example.employee_management.entity.EmployeeSeparation;
import com.example.employee_management.service.EmployeeSeparationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-separations")
public class EmployeeSeparationController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeSeparationController.class);

    @Autowired
    private EmployeeSeparationService employeeSeparationService;

    @PostMapping
    public EmployeeSeparation createSeparationRequest(@RequestBody EmployeeSeparation request) {
        logger.info("Received POST request to create separation: EmployeeId={}", request.getEmployeeId());
        return employeeSeparationService.createSeparationRequest(request);
    }

    @GetMapping
    public List<EmployeeSeparation> getSeparationsByStatus(
            @RequestParam(name = "status") Integer status,
            @SortDefault(sort = "requestDate", direction = Sort.Direction.DESC) Sort sort) {
        return employeeSeparationService.getSeparationsByStatusAndSort(status, sort);
    }

    @GetMapping("/employee/{employeeId}")
    public List<EmployeeSeparation> getEmployeeSeparations(@PathVariable String employeeId) {
        return employeeSeparationService.getEmployeeSeparations(employeeId);
    }

    /**
     * New endpoint to get all rejected separation requests for a specific employee.
     * @param employeeId The employee's ID.
     * @return A list of separation requests with status 3 (Dept Rejected) or 4 (HR Rejected).
     */
    @GetMapping("/employee/{employeeId}/rejected")
    public List<EmployeeSeparation> getRejectedEmployeeSeparations(@PathVariable String employeeId) {
        logger.info("Received GET request for rejected separations for employee ID: {}", employeeId);
        return employeeSeparationService.getRejectedSeparationsForEmployee(employeeId);
    }

    @GetMapping("/pending")
    public List<EmployeeSeparation> getPendingSeparations() {
        return employeeSeparationService.getPendingSeparations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeSeparation> getSeparationById(@PathVariable String id) {
        EmployeeSeparation separation = employeeSeparationService.getSeparationById(id);
        if (separation != null) {
            logger.info("Found separation request by ID {}", id);
            return ResponseEntity.ok(separation);
        } else {
            logger.warn("Separation request not found by ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public EmployeeSeparation updateSeparation(@PathVariable String id, @RequestBody EmployeeSeparation separation) {
        logger.info("Received PUT request to update separation ID {}", id);
        separation.setId(id); // Ensure ID from path is used
        return employeeSeparationService.updateSeparation(separation);
    }
}