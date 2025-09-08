package com.example.employee_management.service.impl;

import com.example.employee_management.entity.VacancyType;
import com.example.employee_management.repository.VacancyTypeRepository;
import com.example.employee_management.service.VacancyTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VacancyTypeServiceImpl implements VacancyTypeService {

    private final VacancyTypeRepository vacancyTypeRepository;

    @Autowired
    public VacancyTypeServiceImpl(VacancyTypeRepository vacancyTypeRepository) {
        this.vacancyTypeRepository = vacancyTypeRepository;
    }

    @Override
    public List<VacancyType> getAllVacancyTypes() {
        return vacancyTypeRepository.findAll();
    }

    @Override
    public VacancyType getVacancyTypeById(Long id) {
        return vacancyTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VacancyType not found with id: " + id));
    }

    @Override
    public VacancyType createVacancyType(VacancyType vacancyType) {
        return vacancyTypeRepository.save(vacancyType);
    }

    @Override
    public VacancyType updateVacancyType(Long id, VacancyType vacancyTypeDetails) {
        VacancyType vacancyType = getVacancyTypeById(id);
        vacancyType.setVacancyType(vacancyTypeDetails.getVacancyType());
        return vacancyTypeRepository.save(vacancyType);
    }

    @Override
    public void deleteVacancyType(Long id) {
        VacancyType vacancyType = getVacancyTypeById(id);
        vacancyTypeRepository.delete(vacancyType);
    }
}