package com.example.employee_management.service.impl;


import com.example.employee_management.entity.HrLuNation;
import com.example.employee_management.repository.HrLuNationRepository;
import com.example.employee_management.service.HrLuNationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuNationServiceImpl implements HrLuNationService {

    private final HrLuNationRepository nationRepository;

    @Autowired
    public HrLuNationServiceImpl(HrLuNationRepository nationRepository) {
        this.nationRepository = nationRepository;
    }

    @Override
    public List<HrLuNation> getAllNations() {
        return nationRepository.findAll();
    }

    @Override
    public HrLuNation getNationById(Integer nationCode) {
        Optional<HrLuNation> nation = nationRepository.findById(nationCode);
        return nation.orElseThrow(() -> new RuntimeException("Nation not found with code: " + nationCode));
    }

    @Override
    public HrLuNation createNation(HrLuNation nation) {
        return nationRepository.save(nation);
    }

    @Override
    public HrLuNation updateNation(Integer nationCode, HrLuNation nationDetails) {
        HrLuNation nation = getNationById(nationCode);

        nation.setDescription(nationDetails.getDescription());
        nation.setName(nationDetails.getName());
        nation.setNationalityId(nationDetails.getNationalityId());

        return nationRepository.save(nation);
    }

    @Override
    public void deleteNation(Integer nationCode) {
        HrLuNation nation = getNationById(nationCode);
        nationRepository.delete(nation);
    }
}
