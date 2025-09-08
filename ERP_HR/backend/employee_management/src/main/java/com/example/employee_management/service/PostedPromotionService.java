package com.example.employee_management.service;

import com.example.employee_management.entity.PostedPromotion;
import com.example.employee_management.entity.VacancyType;
import com.example.employee_management.repository.PostedPromotionRepository;
import com.example.employee_management.repository.VacancyTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostedPromotionService {

    private final PostedPromotionRepository postedPromotionRepository;
    private final VacancyTypeRepository vacancyTypeRepository;

    @Autowired
    public PostedPromotionService(PostedPromotionRepository postedPromotionRepository,
                                  VacancyTypeRepository vacancyTypeRepository) {
        this.postedPromotionRepository = postedPromotionRepository;
        this.vacancyTypeRepository = vacancyTypeRepository;
    }

    public List<PostedPromotion> getAllPostedPromotions() {
        return postedPromotionRepository.findAll();
    }

    public Optional<PostedPromotion> getPostedPromotionById(String id) {
        return postedPromotionRepository.findById(id);
    }

    public PostedPromotion createPostedPromotion(PostedPromotion postedPromotion) {
        // Validate that the vacancyType exists
        if (postedPromotion.getVacancyType() != null &&
                postedPromotion.getVacancyType().getVacancyTypeId() != null) {
            VacancyType vacancyType = vacancyTypeRepository.findById(
                            postedPromotion.getVacancyType().getVacancyTypeId())
                    .orElseThrow(() -> new RuntimeException(
                            "VacancyType not found with id: " + postedPromotion.getVacancyType().getVacancyTypeId()));
            postedPromotion.setVacancyType(vacancyType);
        }
        return postedPromotionRepository.save(postedPromotion);
    }

    public PostedPromotion updatePostedPromotion(String id, PostedPromotion postedPromotionDetails) {
        PostedPromotion postedPromotion = postedPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Posted Promotion not found with id: " + id));

        // Update vacancyType if provided
        if (postedPromotionDetails.getVacancyType() != null &&
                postedPromotionDetails.getVacancyType().getVacancyTypeId() != null) {
            VacancyType vacancyType = vacancyTypeRepository.findById(
                            postedPromotionDetails.getVacancyType().getVacancyTypeId())
                    .orElseThrow(() -> new RuntimeException(
                            "VacancyType not found with id: " + postedPromotionDetails.getVacancyType().getVacancyTypeId()));
            postedPromotion.setVacancyType(vacancyType);
        }

        // Update other fields
        postedPromotion.setStartDate(postedPromotionDetails.getStartDate());
        postedPromotion.setDeadLine(postedPromotionDetails.getDeadLine());
        postedPromotion.setDescription(postedPromotionDetails.getDescription());
        postedPromotion.setNotes(postedPromotionDetails.getNotes());
        postedPromotion.setPreparedBy(postedPromotionDetails.getPreparedBy());
        postedPromotion.setGivenComment(postedPromotionDetails.getGivenComment());

        return postedPromotionRepository.save(postedPromotion);
    }

    public void deletePostedPromotion(String id) {
        PostedPromotion postedPromotion = postedPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Posted Promotion not found with id: " + id));
        postedPromotionRepository.delete(postedPromotion);
    }
}