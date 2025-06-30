package com.example.employee_management.service;

import com.example.employee_management.entity.TerminationReason;
import com.example.employee_management.repository.TerminationReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TerminationReasonService {

    @Autowired
    private TerminationReasonRepository terminationReasonRepository;

    public List<TerminationReason> getAllReasons() {
        return terminationReasonRepository.findAll();
    }

    public Optional<TerminationReason> getReasonById(Long id) {
        return terminationReasonRepository.findById(id);
    }

    public TerminationReason createReason(TerminationReason reason) {
        return terminationReasonRepository.save(reason);
    }

    public TerminationReason updateReason(Long id, TerminationReason updatedReason) {
        if (terminationReasonRepository.existsById(id)) {
            updatedReason.setTerminationReasonId(id);
            return terminationReasonRepository.save(updatedReason);
        }
        return null;
    }

    public void deleteReason(Long id) {
        terminationReasonRepository.deleteById(id);
    }
}