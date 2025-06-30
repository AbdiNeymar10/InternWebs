package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuDocumentType;
import com.example.employee_management.repository.HrLuDocumentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrLuDocumentTypeService {
    @Autowired
    private HrLuDocumentTypeRepository repository;

    public List<HrLuDocumentType> getAllDocumentTypes() {
        return repository.findAll();
    }
}