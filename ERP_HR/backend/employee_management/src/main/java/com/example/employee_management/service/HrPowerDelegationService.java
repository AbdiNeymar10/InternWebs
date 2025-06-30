package com.example.employee_management.service;

import com.example.employee_management.entity.HrPowerDelegation;
import com.example.employee_management.repository.HrPowerDelegationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrPowerDelegationService {

    @Autowired
    private HrPowerDelegationRepository repository;

    public List<HrPowerDelegation> findAll() {
        return repository.findAll();
    }

    public Optional<HrPowerDelegation> findById(Long id) {
        return repository.findById(id);
    }

    public HrPowerDelegation save(HrPowerDelegation delegation) {
        return repository.save(delegation);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
    public List<HrPowerDelegation> findByDelegatorId(String delegatorId) {
        return repository.findByDelegatorId(delegatorId);
    }
    public List<HrPowerDelegation> findByDelegateeId(String delegateeId) {
        return repository.findByDelegateeId(delegateeId);
    }
}