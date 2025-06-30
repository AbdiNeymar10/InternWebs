package com.example.employee_management.controller;

import com.example.employee_management.entity.HR_Rank;
import com.example.employee_management.service.HR_RankService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr-rank")
@CrossOrigin(origins = "http://localhost:3000")
public class HR_RankController {

    private final HR_RankService service;

    public HR_RankController(HR_RankService service) {
        this.service = service;
    }

    // Get all ranks
    @GetMapping
    public ResponseEntity<List<HR_Rank>> getAllRanks() {
        return ResponseEntity.ok(service.findAll());
    }

    // Get ranks by ICF and Class
    @GetMapping("/filter")
    public ResponseEntity<List<HR_Rank>> getRanksByIcfAndClass(
            @RequestParam Long icfId,
            @RequestParam Long classId) {
        try {
            List<HR_Rank> ranks = service.findByIcfAndClass(icfId, classId);
            return ResponseEntity.ok(ranks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Save a single rank
   @PostMapping
public ResponseEntity<HR_Rank> saveRank(@RequestBody HR_Rank rank) {
    try {
        HR_Rank savedRank = service.save(rank);
        return ResponseEntity.ok(savedRank);
    } catch (Exception e) {
        e.printStackTrace(); 
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}

 @PostMapping("/bulk-save")
public ResponseEntity<?> saveRanks(@RequestBody List<HR_Rank> ranks) {
    try {

        List<HR_Rank> savedRanks = ranks.stream().map(rank -> {
            if (rank.getRankId() != null) {
                Optional<HR_Rank> existingRank = service.findById(rank.getRankId());
                if (existingRank.isPresent()) {
                    HR_Rank existing = existingRank.get();
                    existing.setJobGrade(rank.getJobGrade());
                    existing.setIcf(rank.getIcf());
                    existing.setBeginningSalary(rank.getBeginningSalary());
                    existing.setMaxSalary(rank.getMaxSalary());
                    return service.save(existing); 
                }
            }
            return service.save(rank); 
        }).toList();

        return ResponseEntity.ok(savedRanks); 
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