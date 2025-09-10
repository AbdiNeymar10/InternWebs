package com.example.employee_management.service;

import com.example.employee_management.entity.HRDocumentProvision;
import com.example.employee_management.repository.HRDocumentProvisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRDocumentProvisionService {
    @Autowired
    private HRDocumentProvisionRepository repository;

    public List<HRDocumentProvision> getAllRequests() {
        return repository.findAll();
    }

    public Optional<HRDocumentProvision> getRequestById(Long id) {
        return repository.findById(id);
    }

    public HRDocumentProvision saveRequest(HRDocumentProvision request) {
        return repository.save(request);
    }

    public List<HRDocumentProvision> getRequestsByWorkId(String workId) {
        return repository.findByWorkId(workId);
    }

    public List<HRDocumentProvision> getRequestsByStatus(String status) {
        return repository.findByStatus(status);
    }

    public List<HRDocumentProvision> getRequestsByWorkIdAndStatus(String workId, String status) {
        return repository.findByWorkIdAndStatus(workId, status);
    }

    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public List<HRDocumentProvision> searchByRequester(String requester) {
        return repository.findByRequesterContainingIgnoreCase(requester);
    }
}