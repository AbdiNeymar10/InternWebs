package com.example.job_reg_backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_EMPLOYMENT_TYPE")
public class HrLuEmploymentType {

    @Id
    @Column(name = "ID", precision = 7)
    private Integer id;

    @Column(name = "TYPE", length = 50)
    private String type;

    // Constructors
    public HrLuEmploymentType() {
    }

    public HrLuEmploymentType(Integer id, String type) {
        this.id = id;
        this.type = type;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "HrLuEmploymentType{" +
                "id=" + id +
                ", type='" + type + '\'' +
                '}';
    }
}