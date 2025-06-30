package com.example.employee_management.dto;

import com.example.employee_management.entity.*;
import com.example.employee_management.repository.HrLuTitleRepository;
import lombok.Data;

import java.util.List;

@Data
public class EmployeeFormOptions {
    private List<HrLuBranch> branches;
    private List<HrLuEmploymentType> employmentTypes;
    private List<HrLuIcf> icfs;
    private List<HrLuJobFamily> jobFamilies;
    private List<HrLuJobType> jobTypes;
    private List<HrLuNation> nations;
    private List<HrLuNationality> nationalities;
    private List<HrLuPositionName> positions;
    private List<HrLuRecruitmentType> recruitmentTypes;
    private List<HrLuReligion> religions;
    private List<HrLuResponsibility> responsibilities;
    private List<HrLuTitleRepository> title;
    private List<Department> departments;

    public void setTitles(List<HrLuTitle> all) {
    }
}