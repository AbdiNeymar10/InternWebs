package com.example.employee_management.service.impl;

import com.example.employee_management.entity.HrLuLanguage;
import com.example.employee_management.repository.HrLuLanguageRepository;
import com.example.employee_management.service.HrLuLanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuLanguageServiceImpl implements HrLuLanguageService {

    private final HrLuLanguageRepository repository;

    @Autowired
    public HrLuLanguageServiceImpl(HrLuLanguageRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<HrLuLanguage> findAll() {
        return repository.findAll();
    }

    @Override
    public HrLuLanguage findById(Long id) {
        Optional<HrLuLanguage> result = repository.findById(id);
        return result.orElseThrow(() -> new RuntimeException("Language not found with id: " + id));
    }

    @Override
    public HrLuLanguage save(HrLuLanguage language) {
        return repository.save(language);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public HrLuLanguage update(Long id, HrLuLanguage language) {
        HrLuLanguage existingLanguage = findById(id);
        existingLanguage.setLanguageName(language.getLanguageName());
        existingLanguage.setDescription(language.getDescription());
        return repository.save(existingLanguage);
    }
}
