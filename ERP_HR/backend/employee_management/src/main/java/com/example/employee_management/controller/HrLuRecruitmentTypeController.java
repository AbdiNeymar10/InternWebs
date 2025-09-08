package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuRecruitmentType;
import com.example.employee_management.service.HrLuRecruitmentTypeService;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
@RequestMapping("/api/recruitment-types")
@CrossOrigin(origins = "http://localhost:3000")
public class HrLuRecruitmentTypeController {

    private final HrLuRecruitmentTypeService recruitmentTypeService;

    @Autowired
    public HrLuRecruitmentTypeController(HrLuRecruitmentTypeService recruitmentTypeService) {
        this.recruitmentTypeService = recruitmentTypeService;
    }

    @PostMapping
    public ResponseEntity<HrLuRecruitmentType> createRecruitmentType(@Valid @RequestBody HrLuRecruitmentType recruitmentType) {
        HrLuRecruitmentType createdType = recruitmentTypeService.createRecruitmentType(recruitmentType);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdType);
    }

    @GetMapping
    public ResponseEntity<List<HrLuRecruitmentType>> getAllRecruitmentTypes() {
        List<HrLuRecruitmentType> types = recruitmentTypeService.getAllRecruitmentTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/{recruitmentId}")
    public ResponseEntity<HrLuRecruitmentType> getRecruitmentTypeById(@PathVariable Integer recruitmentId) {
        HrLuRecruitmentType type = recruitmentTypeService.getRecruitmentTypeById(recruitmentId);
        return ResponseEntity.ok(type);
    }

    @PutMapping("/{recruitmentId}")
    public ResponseEntity<HrLuRecruitmentType> updateRecruitmentType(
            @PathVariable Integer recruitmentId,
            @Valid @RequestBody HrLuRecruitmentType recruitmentTypeDetails) {
        HrLuRecruitmentType updatedType = recruitmentTypeService.updateRecruitmentType(recruitmentId, recruitmentTypeDetails);
        return ResponseEntity.ok(updatedType);
    }

    @DeleteMapping("/{recruitmentId}")
    public ResponseEntity<Void> deleteRecruitmentType(@PathVariable Integer recruitmentId) {
        recruitmentTypeService.deleteRecruitmentType(recruitmentId);
        return ResponseEntity.noContent().build();
    }
}
