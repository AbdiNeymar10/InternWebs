package com.example.employee_management.controller;

import com.example.employee_management.dto.EmployeeDetailsDTO2;
import com.example.employee_management.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Removed: import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService; // Use the service

    @Autowired
    public EmployeeController(EmployeeService employeeService) { // Inject EmployeeService
        this.employeeService = employeeService;
    }

    @GetMapping("/by-emp-id/{empId}")
    public ResponseEntity<EmployeeDetailsDTO2> getEmployeeByBusinessId(@PathVariable String empId) {
        EmployeeDetailsDTO2 employeeDetailsDTO = employeeService.getEmployeeDetailsByEmpId(empId);
        // The service method now throws ResourceNotFoundException if employee is not found.
        // If it returned null, you'd check here:
        // if (employeeDetailsDTO == null) {
        //     return ResponseEntity.notFound().build();
        // }
        return ResponseEntity.ok(employeeDetailsDTO);
    }

    // Example: If you still need an endpoint that returns the raw Employee entity
    // (perhaps for internal use or other parts of the system), you could keep it
    // or create a new one, but it would need access to EmployeeRepository.
    // For this specific request, we are modifying the existing /by-emp-id/{empId}
    // to return the DTO.

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    // If you need to keep the old getEmployeeByDatabaseId that returns raw Employee:
    // You would need EmployeeRepository injected here or call a service method that returns raw Employee.
    // For simplicity, I'm assuming the primary goal is to update the /by-emp-id endpoint.
    // @Autowired
    // private EmployeeRepository employeeRepository; // If you need direct access for other endpoints

    // @GetMapping("/{id}")
    // public ResponseEntity<Employee> getEmployeeByDatabaseId(@PathVariable Long id) {
    //     return employeeRepository.findById(id)
    //             .map(ResponseEntity::ok)
    //             .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    // }
}
