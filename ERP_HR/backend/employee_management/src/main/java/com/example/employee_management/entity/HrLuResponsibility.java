package com.example.employee_management.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_RESPONSIBILITY")
public class HrLuResponsibility {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "RESPONSIBILITY", length = 255)
    private String responsibility;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    // Constructors
    public HrLuResponsibility() {
    }

    public HrLuResponsibility(Long id, String responsibility, String description) {
        this.id = id;
        this.responsibility = responsibility;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(String responsibility) {
        this.responsibility = responsibility;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // toString
    @Override
    public String toString() {
        return "HrLuResponsibility{" +
                "id=" + id +
                ", responsibility='" + responsibility + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
