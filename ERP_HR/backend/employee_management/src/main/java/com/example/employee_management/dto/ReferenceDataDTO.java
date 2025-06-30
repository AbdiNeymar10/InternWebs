package com.example.employee_management.dto;

import com.example.employee_management.entity.HrLuEmploymentType;
import com.example.employee_management.entity.Institution;
import com.example.employee_management.entity.OrganizationTitle;
import com.example.employee_management.entity.TerminationReason;

import java.util.List;

public class ReferenceDataDTO {
    private List<HrLuEmploymentType> employmentTypes;
    private List<Institution> institutions;
    private List<OrganizationTitle> organizationTitles;
    private List<TerminationReason> terminationReasons;

    // Getters and Setters
    public List<HrLuEmploymentType> getEmploymentTypes() { return employmentTypes; }
    public void setEmploymentTypes(List<HrLuEmploymentType> employmentTypes) { this.employmentTypes = employmentTypes; }

    public List<Institution> getInstitutions() { return institutions; }
    public void setInstitutions(List<Institution> institutions) { this.institutions = institutions; }

    public List<OrganizationTitle> getOrganizationTitles() { return organizationTitles; }
    public void setOrganizationTitles(List<OrganizationTitle> organizationTitles) { this.organizationTitles = organizationTitles; }

    public List<TerminationReason> getTerminationReasons() { return terminationReasons; }
    public void setTerminationReasons(List<TerminationReason> terminationReasons) { this.terminationReasons = terminationReasons; }


}