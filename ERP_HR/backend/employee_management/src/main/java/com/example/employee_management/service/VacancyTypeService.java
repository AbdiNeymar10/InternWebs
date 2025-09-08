package com.example.employee_management.service;

import com.example.employee_management.entity.VacancyType;
import java.util.List;

public interface VacancyTypeService {
    List<VacancyType> getAllVacancyTypes();
    VacancyType getVacancyTypeById(Long id);
    VacancyType createVacancyType(VacancyType vacancyType);
    VacancyType updateVacancyType(Long id, VacancyType vacancyType);
    void deleteVacancyType(Long id);
}