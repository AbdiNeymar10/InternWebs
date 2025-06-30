package com.example.employee_management.service;

import com.example.employee_management.entity.Education;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.EducationRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EducationService {

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private HrEmployeeRepository employeeRepository;

    public List<Education> getEducationsByEmployee(String empId) {
        List<Education> educations = educationRepository.findByEmployee_EmpId(empId);
        return educations;
    }

    public Education getById(Long id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education record not found with id: " + id));
    }

    public Education createEducationForEmployee(String empId, Education education) {
        HrEmployee employee = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));
        education.setEmployee(employee);
        return educationRepository.save(education);
    }

    public Education update(Long id, Education updated) {
        Education education = getById(id);
        updated.setEmpEduId(id);
        updated.setEmployee(education.getEmployee());
        return educationRepository.save(updated);
    }

    public void delete(Long id) {
        Education education = getById(id);
        educationRepository.delete(education);
    }
}