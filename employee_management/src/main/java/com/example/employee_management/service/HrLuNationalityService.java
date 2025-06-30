package com.example.employee_management.service;
import com.example.employee_management.entity.HrLuNationality;
import com.example.employee_management.repository.HrLuNationalityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuNationalityService {

    @Autowired
    private HrLuNationalityRepository repository;

    public List<HrLuNationality> findAll() {
        return repository.findAll();
    }

    public Optional<HrLuNationality> findById(Long id) {
        return repository.findById(id);
    }

    public HrLuNationality save(HrLuNationality nationality) {
        return repository.save(nationality);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public HrLuNationality update(Long id, HrLuNationality updatedNationality) {
        return repository.findById(id)
                .map(nationality -> {
                    nationality.setNationalityName(updatedNationality.getNationalityName());
                    nationality.setNationalityDescription(updatedNationality.getNationalityDescription());
                    return repository.save(nationality);
                })
                .orElseGet(() -> {
                    updatedNationality.setNationalityId(id);
                    return repository.save(updatedNationality);
                });
    }
}
