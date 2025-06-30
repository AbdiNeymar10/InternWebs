package com.example.employee_management.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "HR_LU_ICF")
public class HrLuIcf {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "ICF", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String icf;

    @Column(name = "DESCRIPTION", length = 255, columnDefinition = "VARCHAR2(255 CHAR)")
    private String description;

    // Constructors
    public HrLuIcf() {
    }

    public HrLuIcf(Long id, String icf, String description) {
        this.id = id;
        this.icf = icf;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIcf() {
        return icf;
    }

    public void setIcf(String icf) {
        this.icf = icf;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "HrLuIcf{" +
                "id=" + id +
                ", icf='" + icf + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
