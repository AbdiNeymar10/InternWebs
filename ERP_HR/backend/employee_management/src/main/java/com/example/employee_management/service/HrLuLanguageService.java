package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuLanguage;
import java.util.List;

public interface HrLuLanguageService {
    List<HrLuLanguage> findAll();
    HrLuLanguage findById(Long id);
    HrLuLanguage save(HrLuLanguage language);
    void deleteById(Long id);
    HrLuLanguage update(Long id, HrLuLanguage language);
}
