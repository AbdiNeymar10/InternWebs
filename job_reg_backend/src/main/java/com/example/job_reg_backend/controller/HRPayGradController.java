package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRPayGrad;
import com.example.job_reg_backend.service.HRPayGradService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.job_reg_backend.model.HRRank;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-pay-grad")
@CrossOrigin(origins = "http://localhost:3000")
public class HRPayGradController {

    private final HRPayGradService payGradService;

    public HRPayGradController(HRPayGradService payGradService) {
        this.payGradService = payGradService;
    }
    // Get all pay grades
    @GetMapping
public ResponseEntity<List<HRPayGrad>> getAllPayGrades() {
    try {
        List<HRPayGrad> payGrades = payGradService.getAllPayGrades();
        return ResponseEntity.ok(payGrades);
    } catch (Exception e) {
        e.printStackTrace(); // Log the exception
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    // Get a specific pay grade by ID
    @GetMapping("/{id}")
    public ResponseEntity<HRPayGrad> getPayGradeById(@PathVariable Long id) {
        Optional<HRPayGrad> payGrad = payGradService.getPayGradeById(id);
        return payGrad.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
   @GetMapping("/filter")
public ResponseEntity<List<HRPayGrad>> getPayGradesByClassAndIcf(
        @RequestParam Long classId,
        @RequestParam Long icfId) {
    try {
        // Fetch all ranks based on classId and icfId
        List<HRRank> ranks = payGradService.getRanksByClassAndIcf(classId, icfId);

        if (ranks.isEmpty()) {
            return ResponseEntity.ok(List.of()); // Return an empty list if no rank is found
        }

        // Fetch pay grades for all matching rankIds
        List<Long> rankIds = ranks.stream().map(HRRank::getRankId).toList();
        List<HRPayGrad> payGrades = payGradService.getPayGradesByRankIds(rankIds);

        return ResponseEntity.ok(payGrades);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    // Save a single pay grade
    @PostMapping
    public ResponseEntity<HRPayGrad> savePayGrade(@RequestBody HRPayGrad payGrad) {
        try {
            HRPayGrad savedPayGrad = payGradService.savePayGrade(payGrad);
            return ResponseEntity.ok(savedPayGrad);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Save multiple pay grades (bulk save)
   @PostMapping("/bulk-save")
public ResponseEntity<?> savePayGrades(@RequestBody List<HRPayGrad> payGrades) {
    try {
        System.out.println("Received Pay Grades Payload: " + payGrades);

        List<HRPayGrad> savedPayGrades = new ArrayList<>();

        for (HRPayGrad payGrad : payGrades) {
            if (payGrad.getRank() == null || payGrad.getRank().getRankId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Rank ID is missing for one or more pay grades.");
            }

            if (payGrad.getPayGradeId() != null) {
                // If payGradeId exists, update
                Optional<HRPayGrad> existingPayGrad = payGradService.getPayGradeById(payGrad.getPayGradeId());
                if (existingPayGrad.isPresent()) {
                    HRPayGrad existing = existingPayGrad.get();
                    existing.setSalary(payGrad.getSalary());
                    existing.setStepNo(payGrad.getStepNo());
                    existing.setRank(payGrad.getRank());
                    savedPayGrades.add(payGradService.savePayGrade(existing));
                    continue;
                }
            }
            // Otherwise save as new
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
}