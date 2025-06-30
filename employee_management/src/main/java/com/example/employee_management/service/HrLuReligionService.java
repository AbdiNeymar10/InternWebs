package com.example.employee_management.service;
import com.example.employee_management.entity.HrLuReligion;
import com.example.employee_management.repository.HrLuReligionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuReligionService {

    private final HrLuReligionRepository religionRepository;

    @Autowired
    public HrLuReligionService(HrLuReligionRepository religionRepository) {
        this.religionRepository = religionRepository;
    }

    public List<HrLuReligion> getAllReligions() {
        return religionRepository.findAll();
    }

    public Optional<HrLuReligion> getReligionById(Long id) {
        return religionRepository.findById(id);
    }

    public HrLuReligion createReligion(HrLuReligion religion) {
        return religionRepository.save(religion);
    }

    public HrLuReligion updateReligion(Long id, HrLuReligion religionDetails) {
        return religionRepository.findById(id)
                .map(religion -> {
                    religion.setName(religionDetails.getName());
                    religion.setDescription(religionDetails.getDescription());
                    return religionRepository.save(religion);
                })
                .orElseGet(() -> {
                    religionDetails.setId(id);
                    return religionRepository.save(religionDetails);
                });
    }

    public void deleteReligion(Long id) {
        religionRepository.deleteById(id);
    }
}
