package com.example.employee_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HR_EMP_LANGUAGE")
@Data
public class HrEmpLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_emp_language_seq_gen")
    @SequenceGenerator(name = "hr_emp_language_seq_gen", sequenceName = "HR_EMP_LANGUAGE_SEQ", allocationSize = 1)
    private Long id;

    // Replace languageType with relationship to HrLuLanguage
    @ManyToOne
    @JoinColumn(name = "LANGUAGE_TYPE", referencedColumnName = "ID", insertable = false, updatable = false)
    private HrLuLanguage language;

    @Column(name = "LANGUAGE_TYPE")
    private Long languageTypeId; // This will store the actual foreign key value

    @Column(name = "READING")
    private String reading;

    @Column(name = "WRITING")
    private String writing;

    @Column(name = "SPEAKING")
    private String speaking;

    @Column(name = "LISTENING")
    private String listening;

    // Foreign key column
    @Column(name = "EMP_ID", length = 20)
    private String empId;

    // Relationship mapping
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMP_ID", insertable = false, updatable = false)
    @JsonIgnore
    private HrEmployee employee;

    public void setEmployee(HrEmployee employee) {
        this.employee = employee;
        if (employee != null) {
            this.empId = employee.getEmpId();
        } else {
            this.empId = null;
        }
    }

    // Add method to set language and keep the ID in sync
    public void setLanguage(HrLuLanguage language) {
        this.language = language;
        if (language != null) {
            this.languageTypeId = language.getId();
        } else {
            this.languageTypeId = null;
        }
    }
}