package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "HR_PROMOTION_POST")
@Getter
@Setter
@ToString(exclude = {"recruitmentRequest", "postedPromotion", "applications"}) // Exclude relationships from toString to prevent loops
public class PromotionPost {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "promotion_post_seq_gen")
    @SequenceGenerator(name = "promotion_post_seq_gen", sequenceName = "HR_PROMOTION_POST_SEQ", allocationSize = 1)
    @Column(name = "ID", nullable = false, updatable = false)
    private Long id;

    @Column(name = "POST_CODE", nullable = false, length = 4000)
    private String postCode;

    @Column(name = "EXPERIENCE", length = 200)
    private String experience;

    @Column(name = "ADDITIONAL_EXPERIENCE", length = 200)
    private String additionalExperience;

    @Column(name = "EDU_LEVEL", length = 200)
    private String educationLevel;

    @Column(name = "FROM_DATE")
    private LocalDate fromDate; // Use modern java.time.LocalDate

    @Column(name = "STATUS", length = 200)
    private String status;

    @Column(name = "PREPARED_BY", length = 4000)
    private String preparedBy;

    // Corrected field name and typo in JoinColumn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECRUITMENT_REQUEST_ID", referencedColumnName = "RECRUIT_REQUEST_ID", nullable = false)
    private RecruitmentRequesttwo recruitmentRequest; // Renamed for clarity

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "APPROVED_BY", length = 4000)
    private String approvedBy;

    @Column(name = "APPROVAL_DATE")
    private LocalDate approvalDate; // Use modern java.time.LocalDate

    @Column(name = "COMMITE_REMARK", length = 4000)
    private String committeeRemark;

    @Column(name = "FOR_EMPLOYEE", length = 200)
    private String forEmployee;

    @Column(name = "SELECTVALUE")
    private Integer selectValue = 0;

    @Column(name = "CRITERIA_STATUS")
    private Integer criteriaStatus;

    @Column(name = "PREPARE", length = 200)
    private String prepare;

    @Column(name = "REMARK", length = 4000)
    private String remark;

    @Column(name = "ACCEPTED_CANDIDATE", length = 200)
    private String acceptedCandidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "POST_PROMOTION_ID", referencedColumnName = "ID")
    private PostedPromotion postedPromotion;

    @Column(name = "PROMOTION_START_DATE")
    private LocalDate promotionStartDate; // Store dates as LocalDate, not String

    // CascadeType.ALL is powerful. It means deleting a PromotionPost will also delete all its applications.
    // Ensure this is the desired behavior.
    @OneToMany(mappedBy = "promotionPost", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PromotionApplication> applications;

    // Implementing equals and hashCode based on the primary key is a best practice for JPA entities.
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PromotionPost that = (PromotionPost) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode(); // Use a constant to avoid issues with transient entities
    }
}