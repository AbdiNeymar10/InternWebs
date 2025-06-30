package com.example.employee_management.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "HR_DEPENDENTS")
@Data
public class Dependent {


    @Id
    @Column(name = "DEPENDENTSID", nullable = false, length = 36) // String, length for UUID
    private String dependentsId;  // Change type to Long

    @Column(name = "FIRSTNAME", length = 255)
    private String firstName;

    @Column(name = "RELATIONSHIP", length = 255)
    private String relationship;

    @Column(name = "STATUS", length = 255)
    private String status;

    @Column(name = "LASTNAME", length = 255)
    private String lastName;

    @Column(name = "MIDELNAME", length = 255)
    private String middleName;

    @Column(name = "SEX", length = 50)
    private String sex;

    @Column(name = "EMERGENCYCONTACT", length = 20)
    private String emergencyContact;

    @Column(name = "DATE_OF_BIRTH", length = 100)
    private String dateOfBirth;

    @Column(name = "BIRTH_DATE_GC")
    @Temporal(TemporalType.DATE)
    private Date birthDateGc;

    // Foreign key column
    @Column(name = "EMP_ID", length = 20)
    private String empId;

    // Relationship mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", insertable = false, updatable = false)
    private HrEmployee employee;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.empId = employee.getEmpId();
        } else {
            this.empId = null;
        }
    }
}