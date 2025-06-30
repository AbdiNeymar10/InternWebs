package com.example.employee_management.controller;

import com.example.employee_management.entity.TerminationReason;
import com.example.employee_management.service.TerminationReasonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/termination-reasons")
@CrossOrigin(origins = "http://localhost:3000")
public class TerminationReasonController {

    @Autowired
    private TerminationReasonService terminationReasonService;

    @GetMapping
    public ResponseEntity<List<TerminationReason>> getAllReasons() {
        List<TerminationReason> reasons = terminationReasonService.getAllReasons();
        return new ResponseEntity<>(reasons, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TerminationReason> getReasonById(@PathVariable Long id) {
        Optional<TerminationReason> reason = terminationReasonService.getReasonById(id);
        return reason.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<TerminationReason> createReason(@RequestBody TerminationReason reason) {
        TerminationReason savedReason = terminationReasonService.createReason(reason);
        return new ResponseEntity<>(savedReason, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TerminationReason> updateReason(@PathVariable Long id, @RequestBody TerminationReason reason) {
        TerminationReason updatedReason = terminationReasonService.updateReason(id, reason);
        if (updatedReason != null) {
            return new ResponseEntity<>(updatedReason, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReason(@PathVariable Long id) {
        terminationReasonService.deleteReason(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}