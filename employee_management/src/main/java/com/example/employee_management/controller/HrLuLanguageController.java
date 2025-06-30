package com.example.employee_management.controller;

import com.example.employee_management.entity.HrLuLanguage;
import com.example.employee_management.service.HrLuLanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
public class HrLuLanguageController {

    private final HrLuLanguageService languageService;

    @Autowired
    public HrLuLanguageController(HrLuLanguageService languageService) {
        this.languageService = languageService;
    }

    @GetMapping
    public List<HrLuLanguage> getAllLanguages() {
        return languageService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuLanguage> getLanguageById(@PathVariable Long id) {
        return ResponseEntity.ok(languageService.findById(id));
    }

    @PostMapping
    public HrLuLanguage createLanguage(@RequestBody HrLuLanguage language) {
        return languageService.save(language);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuLanguage> updateLanguage(@PathVariable Long id, @RequestBody HrLuLanguage language) {
        return ResponseEntity.ok(languageService.update(id, language));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable Long id) {
        languageService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
