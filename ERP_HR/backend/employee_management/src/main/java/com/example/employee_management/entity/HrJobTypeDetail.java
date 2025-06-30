package com.example.employee_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    @Column(name = "JOB_TYPE_ID") // NUMBER(7,0)
    private Long jobTypeId; // This was used to link to HR_JOB_TYPE.ID

    @Column(name = "ICF_ID") // NUMBER(7,0)
    private Long icfId;

    @Column(name = "POSITION_CODE") // VARCHAR2(255 CHAR)
    private String positionCode;

    @Column(name = "STATUS") // NUMBER(7,0)
    private Integer status;

    @Column(name = "REMARK") // VARCHAR2(255 CHAR)
    private String remark;
}