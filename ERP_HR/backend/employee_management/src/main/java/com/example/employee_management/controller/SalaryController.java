package com.example.employee_management.controller;

import com.example.employee_management.dto.PayGradeStepDto;
import com.example.employee_management.dto.SalaryStepDto;
import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/salary")
public class SalaryController {

    private final SalaryService salaryService;

    @Autowired
    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping("/all-pay-grades")
    public ResponseEntity<List<HrPayGrad>> getAllPayGrades() {
        List<HrPayGrad> payGrades = salaryService.getAllPayGrades();
        return ResponseEntity.ok(payGrades);
    }

    // src/main/java/com/example/employee_management/controller/SalaryController.java
    @GetMapping("/pay-grades-by-rank")
    public ResponseEntity<List<PayGradeStepDto>> getPayGradesByRank(@RequestParam Long rankId) {
        List<PayGradeStepDto> result = salaryService.getSalaryAndStepNoByRankId(rankId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/steps")
    public ResponseEntity<List<SalaryStepDto>> getSalarySteps(
            @RequestParam Long jobTitleId,
            @RequestParam Long icfId) {
        // Pass jobTitleId directly as a Long if the service method expects/accepts it
        List<SalaryStepDto> steps = salaryService.getSalarySteps(jobTitleId, icfId);
        return ResponseEntity.ok(steps);
    }

    @GetMapping("/salary-for-step")
    public ResponseEntity<String> getSalaryForStep(
            @RequestParam Long jobTitleId,
            @RequestParam Long icfId,
            @RequestParam Integer stepNo) {
        String salary = salaryService.getSalaryForStep(jobTitleId, icfId, stepNo);
        return ResponseEntity.ok(salary);
    }
}