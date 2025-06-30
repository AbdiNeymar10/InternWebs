package com.example.employee_management.controller;

import com.example.employee_management.dto.HrLuRegionDTO;
import com.example.employee_management.service.HrLuRegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hr-lu-region")
@RequiredArgsConstructor
public class HrLuRegionController {
    private final HrLuRegionService hrLuRegionService;

    @GetMapping
    public ResponseEntity<List<HrLuRegionDTO>> getAllRegions() {
        List<HrLuRegionDTO> regions = hrLuRegionService.getAllRegions();

        if (regions.isEmpty() || regions.get(0).getId() == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(regions);
    }
}