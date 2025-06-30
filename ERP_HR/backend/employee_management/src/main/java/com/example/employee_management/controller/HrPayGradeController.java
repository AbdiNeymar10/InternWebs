package com.example.employee_management.controller;

import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.service.HrPayGradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pay-grades")
public class HrPayGradeController {

    private final HrPayGradeService hrPayGradeService;

    public HrPayGradeController(HrPayGradeService hrPayGradeService) {
        this.hrPayGradeService = hrPayGradeService;
    }

    @GetMapping
    public ResponseEntity<List<HrPayGrad>> getAllPayGrades() {
        return ResponseEntity.ok(hrPayGradeService.findAll());
    }

    @GetMapping("/{payGradeId}")
    public ResponseEntity<HrPayGrad> getPayGradeById(@PathVariable Long payGradeId) {
        return ResponseEntity.ok(hrPayGradeService.findById(payGradeId));
    }

    @PostMapping
    public ResponseEntity<HrPayGrad> createPayGrade(@RequestBody HrPayGrad hrPayGrad) {
        return ResponseEntity.ok(hrPayGradeService.save(hrPayGrad));
    }

    @PutMapping("/{payGradeId}")
    public ResponseEntity<HrPayGrad> updatePayGrade(
            @PathVariable Long payGradeId,
            @RequestBody HrPayGrad hrPayGrad) {
        return ResponseEntity.ok(hrPayGradeService.update(payGradeId, hrPayGrad));
    }

    @DeleteMapping("/{payGradeId}")
    public ResponseEntity<Void> deletePayGrade(@PathVariable Long payGradeId) {
        hrPayGradeService.deleteById(payGradeId);
        return ResponseEntity.noContent().build();
    }
}