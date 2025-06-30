package com.example.employee_management.controller;

import com.example.employee_management.entity.HrRank;
import com.example.employee_management.service.HrRankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hr-ranks")
public class HrRankController {

    private final HrRankService hrRankService;

    public HrRankController(HrRankService hrRankService) {
        this.hrRankService = hrRankService;
    }

    @GetMapping
    public ResponseEntity<List<HrRank>> getAllHrRanks() {
        return ResponseEntity.ok(hrRankService.findAll());
    }

    @GetMapping("/{rankId}")
    public ResponseEntity<HrRank> getHrRankById(@PathVariable Long rankId) {
        return ResponseEntity.ok(hrRankService.findById(rankId));
    }

    @PostMapping
    public ResponseEntity<HrRank> createHrRank(@RequestBody HrRank hrRank) {
        return ResponseEntity.ok(hrRankService.save(hrRank));
    }

    @PutMapping("/{rankId}")
    public ResponseEntity<HrRank> updateHrRank(@PathVariable Long rankId, @RequestBody HrRank hrRank) {
        return ResponseEntity.ok(hrRankService.update(rankId, hrRank));
    }

    @DeleteMapping("/{rankId}")
    public ResponseEntity<Void> deleteHrRank(@PathVariable Long rankId) {
        hrRankService.deleteById(rankId);
        return ResponseEntity.noContent().build();
    }
}