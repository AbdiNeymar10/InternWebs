package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HR_EMP_COSTSHARING")
public class CostSharing {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cost_sharing_seq")
    @SequenceGenerator(name = "cost_sharing_seq", sequenceName = "HR_EMP_COSTSHARING_SEQ", allocationSize = 1)
    @Column(name = "ID")
    private Long id;

    // Foreign key column
    @Column(name = "EMP_ID", length = 20, insertable = false, updatable = false)
    private String empId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID")
    private HrEmployee employee;

    @Column(name = "TOTAL_BIRR")
    private Double totalAmount;

    @Column(name = "PAID_AMOUNT")
    private Double amountPaid;

    @Column(name = "REMARK")
    private String remark;

    @Column(name = "STATUS")
    private Integer status;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.empId = employee.getEmpId();
        } else {
            this.empId = null;
        }
    }
}