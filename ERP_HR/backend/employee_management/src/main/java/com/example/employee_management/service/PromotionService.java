package com.example.employee_management.service;

import com.example.employee_management.dto.CreateFullPromotionRequest;
import com.example.employee_management.entity.PostedPromotion;
import com.example.employee_management.entity.PromotionPost;
import com.example.employee_management.entity.RecruitmentRequesttwo;
import com.example.employee_management.entity.VacancyType;
import com.example.employee_management.repository.PostedPromotionRepository;
import com.example.employee_management.repository.PromotionPostRepository;
import com.example.employee_management.repository.RecruitmentRequestRepositorytwo;
import com.example.employee_management.repository.VacancyTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromotionService {

    private static final Logger log = LoggerFactory.getLogger(PromotionService.class);

    private final PostedPromotionRepository postedPromotionRepository;
    private final PromotionPostRepository promotionPostRepository;
    private final RecruitmentRequestRepositorytwo recruitmentRequestRepositorytwo;
    private final VacancyTypeRepository vacancyTypeRepository;

    public PromotionService(PostedPromotionRepository postedPromotionRepository,
                            PromotionPostRepository promotionPostRepository,
                            RecruitmentRequestRepositorytwo recruitmentRequestRepositorytwo,
                            VacancyTypeRepository vacancyTypeRepository) {
        this.postedPromotionRepository = postedPromotionRepository;
        this.promotionPostRepository = promotionPostRepository;
        this.recruitmentRequestRepositorytwo = recruitmentRequestRepositorytwo;
        this.vacancyTypeRepository = vacancyTypeRepository;
    }

    /**
     * Creates a complete promotion, including the parent PostedPromotion and the child PromotionPost.
     * This method operates as a single transaction.
     *
     * @param request A DTO containing all necessary information.
     * @return The newly created PromotionPost entity.
     */
    @Transactional
    public PromotionPost createFullPromotion(CreateFullPromotionRequest request) {
        log.info("Creating a full promotion for vacancy type ID: {}", request.getVacancyTypeId());

        // === Part 1: Create and save the parent HR_POSTED_PROMOTION record ===

        VacancyType vacancyType = vacancyTypeRepository.findById(request.getVacancyTypeId())
                .orElseThrow(() -> new EntityNotFoundException("VacancyType not found with ID: " + request.getVacancyTypeId()));

        PostedPromotion newPostedPromotion = new PostedPromotion();

        // CLEANUP: Removed the complex and unnecessary date handling block.
        // The service should assume the DTO provides correctly typed data (e.g., LocalDate).
        newPostedPromotion.setStartDate(request.getStartDate());
        newPostedPromotion.setDeadLine(request.getDeadline());
        newPostedPromotion.setVacancyType(vacancyType);
        newPostedPromotion.setDescription(request.getDescription());
        newPostedPromotion.setCommentGiven(request.getCommentGiven());
        newPostedPromotion.setPreparedBy(request.getPreparedBy());

        PostedPromotion savedPostedPromotion = postedPromotionRepository.save(newPostedPromotion);
        log.info("Saved new PostedPromotion with ID: {}", savedPostedPromotion.getId());

        // === Part 2: Prepare and save the child HR_PROMOTION_POST record ===

        RecruitmentRequesttwo selectedJobTitle = recruitmentRequestRepositorytwo
                .findById(request.getRecruitmentRequestId())
                .orElseThrow(() -> new EntityNotFoundException("RecruitmentRequesttwo not found with ID: " + request.getRecruitmentRequestId()));

        PromotionPost newPromotionPost = new PromotionPost();
        newPromotionPost.setForEmployee(request.getForEmployee());
        newPromotionPost.setAdditionalExperience(request.getAdditionalExperience());
        newPromotionPost.setPostCode(request.getPostCode());
        newPromotionPost.setPreparedBy(request.getPreparedBy());

        // === Part 3: Link the entities together ===

        newPromotionPost.setPostedPromotion(savedPostedPromotion);
        // This assumes the PromotionPost entity has a method setRecruitmentRequest(RecruitmentRequesttwo)
        newPromotionPost.setRecruitmentRequest(selectedJobTitle);

        PromotionPost savedPromotionPost = promotionPostRepository.save(newPromotionPost);
        log.info("Saved new PromotionPost with ID: {} linked to PostedPromotion ID: {}", savedPromotionPost.getId(), savedPostedPromotion.getId());

        return savedPromotionPost;
    }
}