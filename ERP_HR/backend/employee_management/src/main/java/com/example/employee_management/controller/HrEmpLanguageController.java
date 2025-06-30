package com.example.employee_management.controller;

import com.example.employee_management.dto.HrEmpLanguageDTO;
import com.example.employee_management.entity.HrEmpLanguage;
import com.example.employee_management.service.HrEmpLanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees/{empId}/languages")
public class HrEmpLanguageController {

    @Autowired
    private HrEmpLanguageService hrEmpLanguageService;

    @GetMapping
    public List<HrEmpLanguageDTO> getLanguagesByEmployee(@PathVariable String empId) {
        return hrEmpLanguageService.getLanguagesByEmployee(empId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrEmpLanguageDTO> getLanguageById(
            @PathVariable String empId,
            @PathVariable Long id) {
        HrEmpLanguage language = hrEmpLanguageService.getLanguageById(id);
        return ResponseEntity.ok(convertToDTO(language));
    }

    @PostMapping
    public ResponseEntity<HrEmpLanguageDTO> createLanguage(
            @PathVariable String empId,
            @RequestBody HrEmpLanguageDTO languageDTO) {
        HrEmpLanguage language = convertToEntity(languageDTO);
        HrEmpLanguage created = hrEmpLanguageService.createLanguageForEmployee(empId, language);
        return ResponseEntity.ok(convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrEmpLanguageDTO> updateLanguage(
            @PathVariable String empId,
            @PathVariable Long id,
            @RequestBody HrEmpLanguageDTO languageDetails) {
        HrEmpLanguage language = convertToEntity(languageDetails);
        HrEmpLanguage updated = hrEmpLanguageService.updateLanguage(id, language);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(
            @PathVariable String empId,
            @PathVariable Long id) {
        hrEmpLanguageService.deleteLanguage(id);
        return ResponseEntity.noContent().build();
    }

    private HrEmpLanguageDTO convertToDTO(HrEmpLanguage language) {
        HrEmpLanguageDTO dto = new HrEmpLanguageDTO();
        dto.setId(language.getId());
        dto.setLanguageTypeId(language.getLanguageTypeId());
        if (language.getLanguage() != null) {
            dto.setLanguageName(language.getLanguage().getLanguageName());
        }
        dto.setReading(language.getReading());
        dto.setWriting(language.getWriting());
        dto.setSpeaking(language.getSpeaking());
        dto.setListening(language.getListening());
        dto.setEmpId(language.getEmpId());
        return dto;
    }

    private HrEmpLanguage convertToEntity(HrEmpLanguageDTO dto) {
        HrEmpLanguage language = new HrEmpLanguage();
        language.setId(dto.getId());
        language.setLanguageTypeId(dto.getLanguageTypeId());
        language.setReading(dto.getReading());
        language.setWriting(dto.getWriting());
        language.setSpeaking(dto.getSpeaking());
        language.setListening(dto.getListening());
        return language;
    }
}