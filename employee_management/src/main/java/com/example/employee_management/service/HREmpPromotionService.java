package com.example.employee_management.service;

import com.example.employee_management.entity.HREmpPromotion;
import com.example.employee_management.repository.HREmpPromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HREmpPromotionService {

    @Autowired
    private HREmpPromotionRepository hrEmpPromotionRepository;

    // Save a new promotion record
    public HREmpPromotion save(HREmpPromotion hrEmpPromotion) {
        return hrEmpPromotionRepository.save(hrEmpPromotion);
    }

    // Update an existing promotion record
    public HREmpPromotion update(HREmpPromotion hrEmpPromotion) {
        return hrEmpPromotionRepository.save(hrEmpPromotion);
    }

    // Get all promotion records
    public List<HREmpPromotion> getAll() {
        return hrEmpPromotionRepository.findAll();
    }

    // Get promotion record by ID
    public HREmpPromotion getById(Long id) {
        return hrEmpPromotionRepository.findById(id).orElse(null);
    }

    // Delete a promotion record by ID
    public void deleteById(Long id) {
        hrEmpPromotionRepository.deleteById(id);
    }
}