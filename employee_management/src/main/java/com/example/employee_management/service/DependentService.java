package com.example.employee_management.service;

import com.example.employee_management.entity.Dependent;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.DependentRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DependentService {

    private final DependentRepository dependentRepository;
    private final HrEmployeeRepository hrEmployeeRepository;

    @Autowired
    public DependentService(DependentRepository dependentRepository,
                            HrEmployeeRepository hrEmployeeRepository) {
        this.dependentRepository = dependentRepository;
        this.hrEmployeeRepository = hrEmployeeRepository;
    }

    public List<Dependent> getAllDependents() {
        return dependentRepository.findAll();
    }

    public List<Dependent> getDependentsByEmployeeId(String empId) {
        if (!hrEmployeeRepository.existsById(empId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + empId);
        }
        return dependentRepository.findByEmployeeEmpId(empId);
    }

    public Dependent getDependentById(String dependentsId) {
        return dependentRepository.findById(dependentsId)
                .orElseThrow(() -> new ResourceNotFoundException("Dependent not found with id: " + dependentsId));
    }

    public Dependent getDependentByIdAndEmployeeId(String dependentsId, String empId) {
        return dependentRepository.findByDependentsIdAndEmployeeEmpId(dependentsId, empId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Dependent not found with id: " + dependentsId + " for employee: " + empId));
    }

    public Dependent createDependent(Dependent dependent) {
        return dependentRepository.save(dependent);
    }

    public Dependent addDependent(String empId, Dependent dependent) {
        // Generate a UUID for the dependent's ID
        dependent.setDependentsId(UUID.randomUUID().toString());

        // Associate the dependent with the employee
        HrEmployee employee = hrEmployeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));
        dependent.setEmployee(employee);

        return dependentRepository.save(dependent);
    }

    public Dependent updateDependent(String dependentsId, Dependent dependentDetails) {
        Dependent dependent = getDependentById(dependentsId);

        dependent.setFirstName(dependentDetails.getFirstName());
        dependent.setMiddleName(dependentDetails.getMiddleName());
        dependent.setLastName(dependentDetails.getLastName());
        dependent.setRelationship(dependentDetails.getRelationship());
        dependent.setStatus(dependentDetails.getStatus());
        dependent.setSex(dependentDetails.getSex());
        dependent.setEmergencyContact(dependentDetails.getEmergencyContact());
        dependent.setDateOfBirth(dependentDetails.getDateOfBirth());
        dependent.setBirthDateGc(dependentDetails.getBirthDateGc());

        return dependentRepository.save(dependent);
    }

    public Dependent updateDependent(String empId, String dependentsId, Dependent dependentDetails) {
        Dependent dependent = getDependentByIdAndEmployeeId(dependentsId, empId);

        dependent.setFirstName(dependentDetails.getFirstName());
        dependent.setMiddleName(dependentDetails.getMiddleName());
        dependent.setLastName(dependentDetails.getLastName());
        dependent.setRelationship(dependentDetails.getRelationship());
        dependent.setStatus(dependentDetails.getStatus());
        dependent.setSex(dependentDetails.getSex());
        dependent.setEmergencyContact(dependentDetails.getEmergencyContact());
        dependent.setDateOfBirth(dependentDetails.getDateOfBirth());
        dependent.setBirthDateGc(dependentDetails.getBirthDateGc());

        return dependentRepository.save(dependent);
    }

    public void deleteDependent(String dependentsId) {
        Dependent dependent = getDependentById(dependentsId);
        dependentRepository.delete(dependent);
    }

    public void deleteDependent(String empId, String dependentsId) {
        Dependent dependent = getDependentByIdAndEmployeeId(dependentsId, empId);
        dependentRepository.delete(dependent);
    }
}