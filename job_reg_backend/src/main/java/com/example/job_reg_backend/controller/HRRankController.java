package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRRank;
import com.example.job_reg_backend.service.HRRankService;
import org.springframework.http.HttpStatus; // Import added
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr-rank")
@CrossOrigin(origins = "http://localhost:3000")
public class HRRankController {

    private final HRRankService service;

    public HRRankController(HRRankService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<HRRank>> getAllRanks() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping("/bulk-save")
    public ResponseEntity<?> saveRanks(@RequestBody List<HRRank> ranks) {
        try {
            List<HRRank> savedRanks = service.saveAll(ranks);
            return ResponseEntity.ok(savedRanks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving ranks: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRank(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}