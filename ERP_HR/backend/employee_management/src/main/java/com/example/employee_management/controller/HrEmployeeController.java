package com.example.employee_management.controller;

import com.example.employee_management.dto.EmployeeInfoDto;
import com.example.employee_management.dto.EmployeeWithPayGradeDto;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.service.HrEmployeeService;
import com.example.employee_management.repository.DepartmentRepository;
import com.example.employee_management.repository.HrLuResponsibilityRepository;
import com.example.employee_management.repository.HrLuBranchRepository;
// import com.example.employee_management.repository.HR_LuIcfRepository;
// import com.example.employee_management.repository.HRPay_GradRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.employee_management.repository.HrLuIcfRepository;
import com.example.employee_management.repository.HrPayGradeRepository;
import com.example.employee_management.entity.HrLuEmploymentType;
import com.example.employee_management.repository.HrLuEmploymentTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class HrEmployeeController {

    private final HrEmployeeService hrEmployeeService;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public HrEmployeeController(HrEmployeeService hrEmployeeService, DepartmentRepository departmentRepository) {
        this.hrEmployeeService = hrEmployeeService;
        this.departmentRepository = departmentRepository;
    }
    @Autowired
    private HrLuEmploymentTypeRepository employmentTypeRepository;

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

    @GetMapping("/{empId}/delegation-details")
    public ResponseEntity<HrEmployeeService.EmployeeDelegationDto> getEmployeeDelegationDetails(
            @PathVariable String empId) {
        HrEmployeeService.EmployeeDelegationDto dto = hrEmployeeService.getEmployeeDelegationDetails(empId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, String>>> searchEmployees(@RequestParam String query) {
        return ResponseEntity.ok(hrEmployeeService.searchEmployees(query));
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

    @GetMapping("/{empId}/image")
    public ResponseEntity<?> getEmployeeImage(@PathVariable String empId) {
        try {
            byte[] photo = hrEmployeeService.getEmployeePhoto(empId);
            String base64Image = Base64.getEncoder().encodeToString(photo);
            return ResponseEntity.ok(Map.of("photo", base64Image));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("photo", null));
        }
    }

    @PostMapping("/{empId}/image")
    public ResponseEntity<?> uploadEmployeeImage(@PathVariable String empId, @RequestBody ImageRequest imageRequest) {
        try {
            if (imageRequest.getProfileImage() == null || imageRequest.getProfileImage().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No image provided"));
            }

            String base64Data;
            String profileImage = imageRequest.getProfileImage().trim();
            if (profileImage.startsWith("data:image/") && profileImage.contains(",")) {
                base64Data = profileImage.split(",")[1]; // Extract base64 data after the comma
            } else {
                base64Data = profileImage; // Assume the entire string is base64 data
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
            hrEmployeeService.updateEmployeePhoto(empId, decodedBytes);
            return ResponseEntity.ok(Map.of("message", "Image uploaded successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Base64 data: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    static class ImageRequest {
        private String profileImage;

        public String getProfileImage() {
            return profileImage;
        }

        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }
    }

    @PutMapping("/{empId}/department")
    public ResponseEntity<?> updateEmployeeDepartment(@PathVariable String empId,
            @RequestBody java.util.Map<String, String> body) {
        String toDepartmentId = body.get("toDepartmentId");
        if (toDepartmentId == null || toDepartmentId.isEmpty()) {
            return ResponseEntity.badRequest().body("toDepartmentId is required");
        }
        HrEmployee employee = hrEmployeeService.getEmployeeById(empId);
        com.example.employee_management.entity.Department department = departmentRepository
                .findById(Long.valueOf(toDepartmentId)).orElse(null);
        if (department == null) {
            return ResponseEntity.badRequest().body("Department not found with id: " + toDepartmentId);
        }
        employee.setDepartment(department);
        hrEmployeeService.updateEmployee(empId, employee);
        return ResponseEntity.ok().build();
    }

    static class EmployeeJobUpdateDto {
        public Long jobResponsibilityId;
        public Long icfId;
        public Long branchId;
        public Long payGradeId;
        public String salary;
        public Integer employmentType;
    }

    @Autowired
    private HrLuResponsibilityRepository hrLuResponsibilityRepository;
    @Autowired
    private HrLuBranchRepository hrLuBranchRepository;
    @Autowired
    private HrLuIcfRepository hrLuIcfRepository;
    @Autowired
    private HrPayGradeRepository hrPayGradRepository;

    @PostMapping("/{empId}/job-update")
    public ResponseEntity<?> updateEmployeeJobFields(
            @PathVariable String empId,
            @RequestBody EmployeeJobUpdateDto dto) {
        HrEmployee employee = hrEmployeeService.getEmployeeById(empId);
        if (dto.jobResponsibilityId != null) {
            var resp = hrLuResponsibilityRepository.findById(dto.jobResponsibilityId).orElse(null);
            employee.setJobResponsibility(resp);
        }
        if (dto.icfId != null) {
            var icf = hrLuIcfRepository.findById(dto.icfId).orElse(null);
            employee.setIcf(icf);
        }
        if (dto.branchId != null) {
            var branch = hrLuBranchRepository.findById(dto.branchId).orElse(null);
            employee.setBranch(branch);
        }
        if (dto.payGradeId != null) {
            var payGrade = hrPayGradRepository.findById(dto.payGradeId).orElse(null);
            employee.setPayGrade(payGrade);
        }
        if (dto.salary != null) {
            employee.setSalary(dto.salary);
        }
        if (dto.employmentType != null) {
    HrLuEmploymentType employmentType = employmentTypeRepository.findById(dto.employmentType)
        .orElseThrow(() -> new RuntimeException("Employment type not found"));
    employee.setEmploymentType(employmentType);
  }

        hrEmployeeService.updateEmployee(empId, employee);
        return ResponseEntity.ok().build();
    }
}