package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuDocumentType;
import com.example.employee_management.repository.HrLuDocumentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuDocumentTypeService {
    
    @Autowired
    private HrLuDocumentTypeRepository repository;
    
    public List<HrLuDocumentType> getAllDocumentTypes() {
        return repository.findAll();
    }
    
    public List<HrLuDocumentType> getActiveDocumentTypes() {
        return repository.findAllActive();
    }
    
    public Optional<HrLuDocumentType> getDocumentTypeById(Long id) {
        return repository.findById(id);
    }
    
    public HrLuDocumentType getDocumentTypeByName(String name) {
        return repository.findByName(name);
    }
    
    public List<HrLuDocumentType> searchDocumentTypesByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }
    
    public HrLuDocumentType saveDocumentType(HrLuDocumentType documentType) {
        return repository.save(documentType);
    }
    
    public void deleteDocumentType(Long id) {
        repository.deleteById(id);
    }
}