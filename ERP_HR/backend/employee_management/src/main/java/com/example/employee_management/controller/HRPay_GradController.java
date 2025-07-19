package com.example.employee_management.controller;

import com.example.employee_management.entity.HRPay_Grad;
import com.example.employee_management.service.HRPay_GradService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.employee_management.entity.HR_Rank;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-pay-grad")
@CrossOrigin(origins = "http://localhost:3000")
public class HRPay_GradController {

    private final HRPay_GradService payGradService;

    public HRPay_GradController(HRPay_GradService payGradService) {
        this.payGradService = payGradService;
    }

    // Get all pay grades
    @GetMapping
    public ResponseEntity<List<HRPay_Grad>> getAllPayGrades() {
        try {
            List<HRPay_Grad> payGrades = payGradService.getAllPayGrades();
            return ResponseEntity.ok(payGrades);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get a specific pay grade by ID
    @GetMapping("/{id}")
    public ResponseEntity<HRPay_Grad> getPayGradeById(@PathVariable Long id) {
        Optional<HRPay_Grad> payGrad = payGradService.getPayGradeById(id);
        return payGrad.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<HRPay_Grad>> getPayGradesByClassAndIcf(
            @RequestParam Long classId,
            @RequestParam Long icfId) {
        try {
            // Fetch all ranks based on classId and icfId
            List<HR_Rank> ranks = payGradService.getRanksByClassAndIcf(classId, icfId);

            if (ranks.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }

            // Fetch pay grades for all matching rankIds
            List<Long> rankIds = ranks.stream().map(HR_Rank::getRankId).toList();
            List<HRPay_Grad> payGrades = payGradService.getPayGradesByRankIds(rankIds);

            return ResponseEntity.ok(payGrades);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Save a single pay grade
    @PostMapping
    public ResponseEntity<HRPay_Grad> savePayGrade(@RequestBody HRPay_Grad payGrad) {
        try {
            HRPay_Grad savedPayGrad = payGradService.savePayGrade(payGrad);
            return ResponseEntity.ok(savedPayGrad);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Save multiple pay grades (bulk save)
    @PostMapping("/bulk-save")
    public ResponseEntity<?> savePayGrades(@RequestBody List<HRPay_Grad> payGrades) {
        try {
            System.out.println("Received Pay Grades Payload: " + payGrades);

            List<HRPay_Grad> savedPayGrades = new ArrayList<>();

            for (HRPay_Grad payGrad : payGrades) {
                if (payGrad.getRank() == null || payGrad.getRank().getRankId() == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Rank ID is missing for one or more pay grades.");
                }

                if (payGrad.getPayGradeId() != null) {
                    Optional<HRPay_Grad> existingPayGrad = payGradService.getPayGradeById(payGrad.getPayGradeId());
                    if (existingPayGrad.isPresent()) {
                        HRPay_Grad existing = existingPayGrad.get();
                        existing.setSalary(payGrad.getSalary());
                        existing.setStepNo(payGrad.getStepNo());
                        existing.setRank(payGrad.getRank());
                        savedPayGrades.add(payGradService.savePayGrade(existing));
                        continue;
                    }
                }
                savedPayGrades.add(payGradService.savePayGrade(payGrad));
            }

            return ResponseEntity.ok(savedPayGrades);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Error saving pay grades: " + e.getMessage() + "\"}");
        }
    }

    // Delete a pay grade by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayGrade(@PathVariable Long id) {
        try {
            payGradService.deletePayGrade(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all unique increment steps (STEP_NO)
    @GetMapping("/steps")
    public ResponseEntity<List<String>> getAllStepNos() {
        try {
            List<String> steps = payGradService.getAllStepNos();
            return ResponseEntity.ok(steps);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get pay grade by step number
    @GetMapping("/step/{stepNo}")
    public ResponseEntity<HRPay_Grad> getPayGradeByStepNo(@PathVariable String stepNo) {
        List<HRPay_Grad> payGrades = payGradService.getAllPayGrades();
        for (HRPay_Grad payGrad : payGrades) {
            if (payGrad.getStepNo() != null && payGrad.getStepNo().equals(stepNo)) {
                return ResponseEntity.ok(payGrad);
            }
        }
        return ResponseEntity.notFound().build();
    }
}