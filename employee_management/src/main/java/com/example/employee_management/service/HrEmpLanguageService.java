package com.example.employee_management.service;

import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.entity.HrEmpLanguage;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.HrEmployeeRepository;
import com.example.employee_management.repository.HrEmpLanguageRepository;
import com.example.employee_management.repository.HrLuLanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class HrEmpLanguageService {

    @Autowired
    private HrEmpLanguageRepository languageRepository;

    @Autowired
    private HrEmployeeRepository employeeRepository;

    @Autowired
    private HrLuLanguageRepository hrLuLanguageRepository;

    public List<HrEmpLanguage> getLanguagesByEmployee(String empId) {
        List<HrEmpLanguage> languages = languageRepository.findByEmployee_EmpId(empId);
        // Load the HrLuLanguage for each record
        languages.forEach(lang -> {
            if (lang.getLanguageTypeId() != null) {
                lang.setLanguage(hrLuLanguageRepository.findById(lang.getLanguageTypeId())
                        .orElse(null));
            }
        });
        return languages;
    }

    public HrEmpLanguage getLanguageById(Long id) {
        HrEmpLanguage language = languageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Language skill not found with id: " + id));
        if (language.getLanguageTypeId() != null) {
            language.setLanguage(hrLuLanguageRepository.findById(language.getLanguageTypeId())
                    .orElse(null));
        }
        return language;
    }

    public HrEmpLanguage createLanguageForEmployee(String empId, HrEmpLanguage language) {
        HrEmployee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));

        // Verify language exists if languageTypeId is provided
        if (language.getLanguageTypeId() != null) {
            hrLuLanguageRepository.findById(language.getLanguageTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Language not found with id: " + language.getLanguageTypeId()));
        }

        language.setEmployee(employee);
        return languageRepository.save(language);
    }

    public HrEmpLanguage updateLanguage(Long id, HrEmpLanguage languageDetails) {
        HrEmpLanguage language = getLanguageById(id);

        // Verify language exists if languageTypeId is provided
        if (languageDetails.getLanguageTypeId() != null) {
            hrLuLanguageRepository.findById(languageDetails.getLanguageTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Language not found with id: " + languageDetails.getLanguageTypeId()));
        }

        language.setLanguageTypeId(languageDetails.getLanguageTypeId());
        language.setReading(languageDetails.getReading());
        language.setWriting(languageDetails.getWriting());
        language.setSpeaking(languageDetails.getSpeaking());
        language.setListening(languageDetails.getListening());

        return languageRepository.save(language);
    }

    public void deleteLanguage(Long id) {
        HrEmpLanguage language = getLanguageById(id);
        languageRepository.delete(language);
    }
}