package com.example.employee_management.service;

import com.example.employee_management.entity.HRTransferRequest;
import com.example.employee_management.repository.HRTransferRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRTransferRequestService {

    @Autowired
    private HRTransferRequestRepository repository;

    public List<HRTransferRequest> getAll() {
        return repository.findAll();
    }

    public Optional<HRTransferRequest> getById(Long id) {
        return repository.findById(id);
    }

    public HRTransferRequest save(HRTransferRequest request) {
        return repository.save(request);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}