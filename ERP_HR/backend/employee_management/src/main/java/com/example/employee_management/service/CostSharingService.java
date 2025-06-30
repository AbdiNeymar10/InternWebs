package com.example.employee_management.service;

import com.example.employee_management.dto.CostSharingDTO;
import com.example.employee_management.entity.CostSharing;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.CostSharingRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CostSharingService {
    @Autowired
    private CostSharingRepository costSharingRepository;

    @Autowired
    private HrEmployeeRepository hrEmployeeRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<CostSharingDTO> getCostSharingsByEmployeeId(String employeeId) {
        if (!hrEmployeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }

        List<CostSharing> costSharings = costSharingRepository.findByEmployee_EmpId(employeeId);
        return costSharings.stream()
                .map(cs -> modelMapper.map(cs, CostSharingDTO.class))
                .collect(Collectors.toList());
    }

    public CostSharingDTO createCostSharing(String empId, CostSharingDTO costSharingDTO) {
        try {
            HrEmployee employee = hrEmployeeRepository.findById(empId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + empId));

            CostSharing costSharing = modelMapper.map(costSharingDTO, CostSharing.class);
            costSharing.setEmployee(employee);
            costSharing.setStatus(1); // Default status

            CostSharing savedCostSharing = costSharingRepository.save(costSharing);
            return modelMapper.map(savedCostSharing, CostSharingDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create cost sharing: " + e.getMessage());
        }
    }

    public CostSharingDTO updateCostSharing(Long id, CostSharingDTO costSharingDTO) {
        CostSharing existingCostSharing = costSharingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cost sharing not found with id: " + id));

        try {
            modelMapper.map(costSharingDTO, existingCostSharing);
            CostSharing updatedCostSharing = costSharingRepository.save(existingCostSharing);
            return modelMapper.map(updatedCostSharing, CostSharingDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update cost sharing: " + e.getMessage());
        }
    }

    public void deleteCostSharing(Long id) {
        if (!costSharingRepository.existsById(id)) {
            throw new RuntimeException("Cost sharing not found with id: " + id);
        }
        costSharingRepository.deleteById(id);
    }
}