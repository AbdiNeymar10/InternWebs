package com.example.employee_management.service;

import com.example.employee_management.entity.PromotionApplication;
import com.example.employee_management.entity.PromotionPost;
import com.example.employee_management.repository.PromotionApplicationRepository;
import com.example.employee_management.repository.PromotionPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PromotionApplicationService {

    @Autowired
    private PromotionApplicationRepository promotionApplicationRepository;

    @Autowired
    private PromotionPostRepository promotionPostRepository;

    public List<PromotionApplication> getAllApplications() {
        return promotionApplicationRepository.findAll();
    }

    public Optional<PromotionApplication> getApplicationById(Long id) {
        return promotionApplicationRepository.findById(id);
    }

    @Transactional
    public PromotionApplication createApplication(PromotionApplication application) {
        // Verify the promotion post exists
        PromotionPost post = promotionPostRepository.findById(application.getPromotionPost().getId())
                .orElseThrow(() -> new RuntimeException("Promotion Post not found with id: " + application.getPromotionPost().getId()));

        // Set the relationship
        application.setPromotionPost(post);

        return promotionApplicationRepository.save(application);
    }

    @Transactional
    public PromotionApplication updateApplication(Long id, PromotionApplication applicationDetails) {
        PromotionApplication application = promotionApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        // Update the promotion post if it's changed
        if (applicationDetails.getPromotionPost() != null &&
                !applicationDetails.getPromotionPost().getId().equals(application.getPromotionPost().getId())) {
            PromotionPost newPost = promotionPostRepository.findById(applicationDetails.getPromotionPost().getId())
                    .orElseThrow(() -> new RuntimeException("Promotion Post not found with id: " + applicationDetails.getPromotionPost().getId()));
            application.setPromotionPost(newPost);
        }

        // Update other fields
        application.setCandidateId(applicationDetails.getCandidateId());
        application.setApplyDate(applicationDetails.getApplyDate());
        application.setStatus(applicationDetails.getStatus());
        application.setTotalMark(applicationDetails.getTotalMark());
        application.setPass(applicationDetails.getPass());
        application.setFilterStatus(applicationDetails.getFilterStatus());
        application.setDescription(applicationDetails.getDescription());
        application.setExamStatus(applicationDetails.getExamStatus());
        application.setPsychoStatus(applicationDetails.getPsychoStatus());
        application.setPassword(applicationDetails.getPassword());

        return promotionApplicationRepository.save(application);
    }

    @Transactional
    public void deleteApplication(Long id) {
        PromotionApplication application = promotionApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        promotionApplicationRepository.delete(application);
    }

    // Optional: Add method to get applications by promotion post ID
    public List<PromotionApplication> getApplicationsByPromotionPostId(Long postId) {
        return promotionApplicationRepository.findByPromotionPostId(postId);
    }
}