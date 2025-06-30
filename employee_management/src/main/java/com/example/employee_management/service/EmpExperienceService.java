package com.example.employee_management.service;

import com.example.employee_management.entity.EmpExperience;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.EmpExperienceRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmpExperienceService {

    private final EmpExperienceRepository empExperienceRepository;
    private final HrEmployeeRepository employeeRepository;

    @Autowired
    public EmpExperienceService(
            EmpExperienceRepository empExperienceRepository,
            HrEmployeeRepository employeeRepository
    ) {
        this.empExperienceRepository = empExperienceRepository;
        this.employeeRepository = employeeRepository;
    }

    public EmpExperience saveExperience(String empId, EmpExperience empExperience) {
        HrEmployee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));
        empExperience.setEmployee(employee);
        return empExperienceRepository.save(empExperience);
    }

    public EmpExperience updateExperience(Long empExpeId, EmpExperience empExperienceDetails) {
        EmpExperience existingExperience = empExperienceRepository.findByEmpExpeId(empExpeId);
        if (existingExperience == null) {
            throw new ResourceNotFoundException("Experience not found with id: " + empExpeId);
        }

        HrEmployee employee = employeeRepository.findById(empExperienceDetails.getEmpId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empExperienceDetails.getEmpId()));

        existingExperience.setEmployee(employee);
        if (empExperienceDetails.getJobTitle() != null)
            existingExperience.setJobTitle(empExperienceDetails.getJobTitle());
        if (empExperienceDetails.getInstitution() != null)
            existingExperience.setInstitution(empExperienceDetails.getInstitution());
        if (empExperienceDetails.getOrganizationType() != null)
            existingExperience.setOrganizationType(empExperienceDetails.getOrganizationType());
        if (empExperienceDetails.getEmploymentType() != null)
            existingExperience.setEmploymentType(empExperienceDetails.getEmploymentType());
        if (empExperienceDetails.getStartDate() != null)
            existingExperience.setStartDate(empExperienceDetails.getStartDate());
        if (empExperienceDetails.getEndDate() != null)
            existingExperience.setEndDate(empExperienceDetails.getEndDate());
        if (empExperienceDetails.getDuration() != null)
            existingExperience.setDuration(empExperienceDetails.getDuration());
        if (empExperienceDetails.getSalary() != null)
            existingExperience.setSalary(empExperienceDetails.getSalary());
        if (empExperienceDetails.getReasonForTermination() != null)
            existingExperience.setReasonForTermination(empExperienceDetails.getReasonForTermination());
        if (empExperienceDetails.getResponsibility() != null)
            existingExperience.setResponsibility(empExperienceDetails.getResponsibility());
        if (empExperienceDetails.getCurrentJobFlag() != null)
            existingExperience.setCurrentJobFlag(empExperienceDetails.getCurrentJobFlag());
        if (empExperienceDetails.getOrgType() != null)
            existingExperience.setOrgType(empExperienceDetails.getOrgType());

        return empExperienceRepository.save(existingExperience);
    }

    public EmpExperience getExperienceById(Long empExpeId) {
        EmpExperience experience = empExperienceRepository.findByEmpExpeId(empExpeId);
        if (experience == null) {
            throw new ResourceNotFoundException("Experience not found with id: " + empExpeId);
        }
        return experience;
    }

    public List<EmpExperience> getExperiencesByEmployeeId(String empId) {
        if (!employeeRepository.existsById(empId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }
        return empExperienceRepository.findByEmpId(empId);
    }

    public void deleteExperience(Long empExpeId) {
        EmpExperience experience = empExperienceRepository.findByEmpExpeId(empExpeId);
        if (experience == null) {
            throw new ResourceNotFoundException("Experience not found with id: " + empExpeId);
        }
        empExperienceRepository.delete(experience);
    }
}