package com.example.employee_management.service;

import com.example.employee_management.dto.EmployeeFormOptions;
import com.example.employee_management.repository.*;
import com.example.employee_management.repository.HrLuEmploymentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeOptionsService {

    @Autowired
    private HrLuBranchRepository branchRepository;

    @Autowired
    private HrLuEmploymentTypeRepository employmentTypeRepository;

    @Autowired
    private HrLuIcfRepository icfRepository;

    @Autowired
    private HrLuJobFamilyRepository jobFamilyRepository;

    @Autowired
    private HrLuJobTypeRepository jobTypeRepository;

    @Autowired
    private HrLuNationRepository nationRepository;

    @Autowired
    private HrLuNationalityRepository nationalityRepository;

    @Autowired
    private HrLuPositionNameRepository positionNameRepository;

    @Autowired
    private HrLuRecruitmentTypeRepository recruitmentTypeRepository;

    @Autowired
    private HrLuReligionRepository religionRepository;

    @Autowired
    private HrLuResponsibilityRepository responsibilityRepository;

    @Autowired
    private HrLuTitleRepository titleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public EmployeeFormOptions getAllOptions() {
        EmployeeFormOptions options = new EmployeeFormOptions();
        options.setBranches(branchRepository.findAll());
        options.setEmploymentTypes(employmentTypeRepository.findAll());
        options.setIcfs(icfRepository.findAll());
        options.setJobFamilies(jobFamilyRepository.findAll());
        options.setJobTypes(jobTypeRepository.findAll());
        options.setNations(nationRepository.findAll());
        options.setNationalities(nationalityRepository.findAll());
        options.setPositions(positionNameRepository.findAll());
        options.setRecruitmentTypes(recruitmentTypeRepository.findAll());
        options.setReligions(religionRepository.findAll());
        options.setResponsibilities(responsibilityRepository.findAll());
        options.setTitles(titleRepository.findAll());
        options.setDepartments(departmentRepository.findAll());
        return options;
    }
}