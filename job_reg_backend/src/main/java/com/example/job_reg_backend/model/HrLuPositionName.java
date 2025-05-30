package com.example.job_reg_backend.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "HR_LU_POSITION_NAME")
public class HrLuPositionName {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @NotBlank(message = "Position name is required")
    @Size(max = 2000, message = "Position name must be at most 2000 characters")
    @Column(name = "NAME", nullable = false, length = 2000)
    private String name;

    @Column(name = "SALARY")
    private Double salary;

    // Constructors
    public HrLuPositionName() {
    }

    public HrLuPositionName(String name, Double salary) {
        this.name = name;
        this.salary = salary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    @Override
    public String toString() {
        return "HrLuPositionName{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", salary=" + salary +
                '}';
    }
}