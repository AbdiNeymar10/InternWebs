package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuTitle;
import com.example.employee_management.service.HrLuTitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/titles")
public class HrLuTitleController {

    @Autowired
    private HrLuTitleService titleService;

    @GetMapping
    public List<HrLuTitle> getAllTitles() {
        return titleService.getAllTitles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuTitle> getTitleById(@PathVariable Long id) {
        return ResponseEntity.ok(titleService.getTitleById(id));
    }

    @PostMapping
    public HrLuTitle createTitle(@RequestBody HrLuTitle title) {
        return titleService.createTitle(title);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuTitle> updateTitle(@PathVariable Long id, @RequestBody HrLuTitle titleDetails) {
        return ResponseEntity.ok(titleService.updateTitle(id, titleDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTitle(@PathVariable Long id) {
        titleService.deleteTitle(id);
        return ResponseEntity.ok().build();
    }
}