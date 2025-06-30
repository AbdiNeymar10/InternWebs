package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "HR_PAY_GRAD")
@Getter
@Setter
public class HrPayGrad {

    @Id
    @Column(name = "PAY_GRADE_ID", nullable = false, precision = 10)
    private Long payGradeId;

    @Column(name = "SALARY", precision = 19, scale = 2) // Use appropriate precision/scale for your DB
    private String salary;

    @Column(name = "STEP_NO", length = 20)
    private String stepNo;

    @ManyToOne
    @JoinColumn(name = "RANK_ID", referencedColumnName = "RANK_ID")
    private HrRank rankId;

    @OneToMany(mappedBy = "payGrade", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<HrEmployee> employees = new ArrayList<>();

    public void addEmployee(HrEmployee employee) {
        if (employee != null) {
            employees.add(employee);
            employee.setPayGrade(this);
        }
    }

    public void removeEmployee(HrEmployee employee) {
        if (employee != null) {
            employees.remove(employee);
            employee.setPayGrade(null);
        }
    }
}