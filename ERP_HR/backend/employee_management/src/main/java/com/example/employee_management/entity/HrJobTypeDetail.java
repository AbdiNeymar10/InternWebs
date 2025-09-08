package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne; // ADDED
import jakarta.persistence.JoinColumn; // ADDED
import jakarta.persistence.FetchType; // ADDED
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "HR_JOB_TYPE_DETAIL")
@Getter
@Setter
public class HrJobTypeDetail {

    @Id
    @Column(name = "ID", nullable = false) // NUMBER(7,0)
    private Long id;

    // MODIFIED: Changed from Long jobTypeId to ManyToOne relationship
    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY loading for performance
    @JoinColumn(name = "JOB_TYPE_ID", referencedColumnName = "ID") // Links to HR_JOB_TYPE.ID
    private HrJobType hrJobType; // Renamed field for clarity

    @Column(name = "ICF_ID") // NUMBER(7,0)
    private Long icfId;

    @Column(name = "POSITION_CODE") // VARCHAR2(255 CHAR)
    private String positionCode;

    @Column(name = "STATUS") // NUMBER(7,0)
    private Integer status;

    @Column(name = "REMARK") // VARCHAR2(255 CHAR)
    private String remark;

    public Long getJobTypeId() {
        return 0L;
    }

    public HrLuIcf getIcf() {
        return null;
    }
}