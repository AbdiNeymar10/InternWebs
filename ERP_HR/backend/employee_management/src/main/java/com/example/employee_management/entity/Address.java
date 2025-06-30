package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "HR_EMP_ADDRESS")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "address_seq")
    @SequenceGenerator(name = "address_seq", sequenceName = "ADDRESS_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", referencedColumnName = "EMP_ID", insertable = false, updatable = false)
    @JsonIgnore
    private HrEmployee employee;

    @Column(name = "EMP_ID", nullable = false, length = 20)
    private String empId;

    @Column(name = "ADD_TYPE", nullable = false)
    private Integer addressType;

    @Column(name = "WOREDA")
    private String wereda;

    @Column(name = "KEBELE")
    private String kebele;

    @Column(name = "TELEPHONE_OFFICE")
    private String telephoneOffice;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "POBOX")
    private String poBox;

    @Column(name = "MOBILE")
    private String mobileNumber;

    @Column(name = "ZONEE")
    private String zone;

    @Column(name = "KIFLE_KETEMA")
    private String kifleketema;

    @Column(name = "TELEPHONE_RESIDENCE")
    private String teleHome;

    @Column(name = "HOUSENO")
    private String houseNo;

    @Column(name = "REGION")
    private String region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REGION", referencedColumnName = "REGION_NAME", insertable = false, updatable = false)
    private HrLuRegion regionDetails;

    // Add method to set employee and keep empId in sync
    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.empId = employee.getEmpId();
        } else {
            this.empId = null;
        }
    }
}