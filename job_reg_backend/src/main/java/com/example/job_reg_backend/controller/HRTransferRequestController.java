package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRTransferRequest;
import com.example.job_reg_backend.service.HRTransferRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/api/hr-transfer-requests")
public class HRTransferRequestController {

    @Autowired
    private HRTransferRequestService service;

    @GetMapping
    public List<HRTransferRequest> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<HRTransferRequest> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public HRTransferRequest create(@RequestBody HRTransferRequest request) {
        return service.save(request);
    }

    @PutMapping("/{id}")
    public HRTransferRequest update(@PathVariable Long id, @RequestBody HRTransferRequest request) {
        request.setTransferRequesterId(id);
        return service.save(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}