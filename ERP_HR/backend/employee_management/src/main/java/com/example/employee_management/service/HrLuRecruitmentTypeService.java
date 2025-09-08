package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuRecruitmentType;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.HrLuRecruitmentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional

public class HrLuRecruitmentTypeService {

    private final HrLuRecruitmentTypeRepository repository;

    @Autowired
    public HrLuRecruitmentTypeService(HrLuRecruitmentTypeRepository repository) {
        this.repository = repository;
    }

    public HrLuRecruitmentType createRecruitmentType(HrLuRecruitmentType recruitmentType) {
        return repository.save(recruitmentType);
    }

    public List<HrLuRecruitmentType> getAllRecruitmentTypes() {
        return repository.findAll();
    }

    public HrLuRecruitmentType getRecruitmentTypeById(Integer recruitmentId) {
        return repository.findById(recruitmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruitment type not found with id: " + recruitmentId));
    }

    public HrLuRecruitmentType updateRecruitmentType(Integer recruitmentId, HrLuRecruitmentType recruitmentTypeDetails) {
        HrLuRecruitmentType recruitmentType = getRecruitmentTypeById(recruitmentId);
        recruitmentType.setRecruitmentType(recruitmentTypeDetails.getRecruitmentType());
        recruitmentType.setDescription(recruitmentTypeDetails.getDescription());
        return repository.save(recruitmentType);
    }

    public void deleteRecruitmentType(Integer recruitmentId) {
        HrLuRecruitmentType recruitmentType = getRecruitmentTypeById(recruitmentId);
        repository.delete(recruitmentType);
    }
}