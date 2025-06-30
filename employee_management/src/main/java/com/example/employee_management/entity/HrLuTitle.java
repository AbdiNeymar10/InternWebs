package com.example.employee_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_TITLE")
public class HrLuTitle {

    @Id
    @Column(name = "TITLEID", nullable = false)
    private Long titleId;

    @Column(name = "TITLE", length = 255)
    private String title;

    // Constructors
    public HrLuTitle() {
    }

    public HrLuTitle(Long titleId, String title) {
        this.titleId = titleId;
        this.title = title;
    }

    // Getters and Setters
    public Long getTitleId() {
        return titleId;
    }

    public void setTitleId(Long titleId) {
        this.titleId = titleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // toString
    @Override
    public String toString() {
        return "HrLuTitle{" +
                "titleId=" + titleId +
                ", title='" + title + '\'' +
                '}';
    }
}