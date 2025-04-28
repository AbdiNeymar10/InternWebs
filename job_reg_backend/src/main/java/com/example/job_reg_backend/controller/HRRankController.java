package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRRank;
import com.example.job_reg_backend.service.HRRankService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-rank")
@CrossOrigin(origins = "http://localhost:3000")
public class HRRankController {

    private final HRRankService service;

    public HRRankController(HRRankService service) {
        this.service = service;
    }

    // Get all ranks
    @GetMapping
    public ResponseEntity<List<HRRank>> getAllRanks() {
        return ResponseEntity.ok(service.findAll());
    }

    // Get ranks by ICF and Class
    @GetMapping("/filter")
    public ResponseEntity<List<HRRank>> getRanksByIcfAndClass(
            @RequestParam Long icfId,
            @RequestParam Long classId) {
        try {
            List<HRRank> ranks = service.findByIcfAndClass(icfId, classId);
            return ResponseEntity.ok(ranks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Save a single rank
   @PostMapping
public ResponseEntity<HRRank> saveRank(@RequestBody HRRank rank) {
    try {
        HRRank savedRank = service.save(rank);
        return ResponseEntity.ok(savedRank);
    } catch (Exception e) {
        e.printStackTrace(); 
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}

    // Save multiple ranks (bulk save)
 @PostMapping("/bulk-save")
public ResponseEntity<?> saveRanks(@RequestBody List<HRRank> ranks) {
    try {
        System.out.println("Bulk save endpoint hit");

        List<HRRank> savedRanks = ranks.stream().map(rank -> {
            if (rank.getRankId() != null) {
                Optional<HRRank> existingRank = service.findById(rank.getRankId());
                if (existingRank.isPresent()) {
                    HRRank existing = existingRank.get();
                    existing.setJobGrade(rank.getJobGrade());
                    existing.setIcf(rank.getIcf());
                    existing.setBeginningSalary(rank.getBeginningSalary());
                    existing.setMaxSalary(rank.getMaxSalary());
                    return service.save(existing); // Update existing record
                }
            }
            return service.save(rank); // Save as a new record
        }).toList();

        return ResponseEntity.ok(savedRanks); // Return the saved ranks as JSON
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"Error saving ranks: " + e.getMessage() + "\"}");
    }
}

    // Delete a rank by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRank(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}