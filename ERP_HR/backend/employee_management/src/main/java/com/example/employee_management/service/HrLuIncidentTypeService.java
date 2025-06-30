package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuIncidentType;
import com.example.employee_management.repository.HrLuIncidentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuIncidentTypeService {

    private final HrLuIncidentTypeRepository repository;

    @Autowired
    public HrLuIncidentTypeService(HrLuIncidentTypeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<HrLuIncidentType> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<HrLuIncidentType> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public HrLuIncidentType save(HrLuIncidentType incidentType) {
        return repository.save(incidentType);
    }

    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}