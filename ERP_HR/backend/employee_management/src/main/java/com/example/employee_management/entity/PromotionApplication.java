package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "HR_PROMOTION_APPLY")
@Data
public class PromotionApplication {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "promotion_apply_seq_gen")
    @SequenceGenerator(name = "promotion_apply_seq_gen", sequenceName = "HR_PROMOTION_APPLY_SEQ", allocationSize = 1)
    @Column(name = "ID", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROMO_POST_ID", referencedColumnName = "ID", nullable = false)
    private PromotionPost promotionPost;

    @Column(name = "CANDIDATE_ID", nullable = false, length = 20)
    private String candidateId;

    @Column(name = "APPLY_DATE")
    @Temporal(TemporalType.DATE)
    private Date applyDate;

    @Column(name = "STATUS", length = 20)
    private String status;

    @Column(name = "TOTAL_MARK")
    private Float totalMark;

    @Column(name = "PASS")
    private Integer pass = 0;

    @Column(name = "FILTER_STATUS")
    private Integer filterStatus;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "EXAM_STATUS")
    private Integer examStatus = 0;

    @Column(name = "PSYCHO_STATUS")
    private Integer psychoStatus = 0;

    @Column(name = "PASSWORD", length = 20)
    private String password;
}