package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "HR_POSTED_PROMOTION")
@Data
public class PostedPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID", nullable = false, updatable = false, length = 36)
    private String id; // Or, more explicitly:  private String postPromotionId;

    @ManyToOne
    @JoinColumn(name = "VACANCY_TYPE", referencedColumnName = "VACANCY_TYPE_ID", nullable = false)
    private VacancyType vacancyType;

    @Column(name = "START_DATE", length = 50)
    private String startDate;

    @Column(name = "DEAD_LINE", length = 50)
    private String deadLine;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "NOTES", length = 4000)
    private String notes;

    @Column(name = "PREPARED_BY", length = 100)
    private String preparedBy;

    @Column(name = "GIVEN_COMMENT", length = 2000)
    private String givenComment;

    public void setDeadline(Date deadline) {

    }

    public void setCommentGiven(String commentGiven) {

    }

    public void setDeadLine(String deadline) {

    }
}