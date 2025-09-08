package com.example.employee_management.service;

import com.example.employee_management.entity.PromotionPost;
import com.example.employee_management.entity.RecruitmentRequesttwo;
import com.example.employee_management.repository.PromotionPostRepository;
import com.example.employee_management.repository.RecruitmentRequestRepositorytwo;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service layer for managing PromotionPost entities.
 */
@Service
public class PromotionPostService {

    private static final Logger log = LoggerFactory.getLogger(PromotionPostService.class);

    private final PromotionPostRepository promotionPostRepository;
    private final RecruitmentRequestRepositorytwo recruitmentRequestRepositorytwo;

    // Constructor injection is a best practice for dependencies.
    public PromotionPostService(PromotionPostRepository promotionPostRepository,
                                RecruitmentRequestRepositorytwo recruitmentRequestRepositorytwo) {
        this.promotionPostRepository = promotionPostRepository;
        this.recruitmentRequestRepositorytwo = recruitmentRequestRepositorytwo;
    }

    /**
     * Creates a new PromotionPost and links it to a selected RecruitmentRequest.
     *
     * @param recruitmentRequestId The ID of the selected job title (RecruitmentRequest).
     * @param postCode The unique code for this promotion post.
     * @param forEmployee The value for the 'forEmployee' field.
     * @param additionalExperience The value for the 'additionalExperience' field.
     * @return The newly created and saved PromotionPost entity.
     * @throws EntityNotFoundException if the RecruitmentRequest is not found.
     */
    @Transactional
    public PromotionPost createPromotionForJobTitle(Long recruitmentRequestId, String postCode, String forEmployee, String additionalExperience) {
        log.info("Creating promotion post for recruitment request ID: {}", recruitmentRequestId);

        // 1. Fetch the full RecruitmentRequest entity.
        RecruitmentRequesttwo selectedJobTitle = recruitmentRequestRepositorytwo
                .findById(recruitmentRequestId)
                .orElseThrow(() -> new EntityNotFoundException("RecruitmentRequesttwo not found with ID: " + recruitmentRequestId));

        // 2. Create the new PromotionPost instance.
        PromotionPost promotionPost = new PromotionPost();

        // 3. Set the fields from the request.
        promotionPost.setPostCode(postCode); // Use the parameter instead of a hardcoded value.
        promotionPost.setForEmployee(forEmployee);
        promotionPost.setAdditionalExperience(additionalExperience);
        // Set any other required fields here...

        // 4. CORRECTED: Set the relationship using the correct method name.
        promotionPost.setRecruitmentRequest(selectedJobTitle);

        // 5. Save the PromotionPost.
        PromotionPost savedPost = promotionPostRepository.save(promotionPost);
        log.info("Successfully created and saved PromotionPost with ID: {}", savedPost.getId());

        return savedPost;
    }
}