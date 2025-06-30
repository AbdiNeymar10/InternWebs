package com.example.employee_management.service;

import com.example.employee_management.entity.Institution;
import com.example.employee_management.repository.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstitutionService {

    @Autowired
    private InstitutionRepository institutionRepository;

    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    public Optional<Institution> getInstitutionById(Long id) {
        return institutionRepository.findById(id);
    }

    public Institution createInstitution(Institution institution) {
        return institutionRepository.save(institution);
    }

    public Institution updateInstitution(Long id, Institution updatedInstitution) {
        if (institutionRepository.existsById(id)) {
            updatedInstitution.setInstitutionId(id);
            return institutionRepository.save(updatedInstitution);
        }
        return null;
    }

    public void deleteInstitution(Long id) {
        institutionRepository.deleteById(id);
    }
}