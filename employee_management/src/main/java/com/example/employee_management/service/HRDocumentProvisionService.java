package com.example.employee_management.service;

import com.example.employee_management.entity.HRDocumentProvision;
import com.example.employee_management.repository.HRDocumentProvisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HRDocumentProvisionService {
    @Autowired
    private HRDocumentProvisionRepository repository;

    public List<HRDocumentProvision> getAllRequests() {
        return repository.findAll();
    }

    public HRDocumentProvision saveRequest(HRDocumentProvision request) {
        return repository.save(request);
    }
}