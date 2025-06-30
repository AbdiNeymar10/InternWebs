package com.example.employee_management.entity;

import com.example.employee_management.util.SalaryEncryptor;
import jakarta.persistence.*;

@Entity
@Table(name = "HR_PAY_GRAD")
public class HRPay_Grad {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pay_grad_seq")
    @SequenceGenerator(name = "pay_grad_seq", sequenceName = "HR_PAY_GRAD_SEQ", allocationSize = 1)
    @Column(name = "PAY_GRADE_ID")
    private Long payGradeId;

    @Convert(converter = SalaryEncryptor.class)
    @Column(name = "SALARY", length = 500)
    private String salary;

    @Column(name = "STEP_NO", length = 20)
    private String stepNo;

    @ManyToOne
    @JoinColumn(name = "RANK_ID", referencedColumnName = "RANK_ID")
    private HR_Rank rank;

    // Constructors
    public HRPay_Grad() {
    }

    public HRPay_Grad(Long payGradeId, String salary, String stepNo, HR_Rank rank) {
        this.payGradeId = payGradeId;
        this.salary = salary;
        this.stepNo = stepNo;
        this.rank = rank;
    }

    // Getters and Setters
    public Long getPayGradeId() {
        return payGradeId;
    }

    public void setPayGradeId(Long payGradeId) {
        this.payGradeId = payGradeId;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getStepNo() {
        return stepNo;
    }

    public void setStepNo(String stepNo) {
        this.stepNo = stepNo;
    }

    public HR_Rank getRank() {
        return rank;
    }

    public void setRank(HR_Rank rank) {
        this.rank = rank;
    }

}