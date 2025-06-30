package com.example.employee_management.controller;

import com.example.employee_management.dto.DependentDTO;
import com.example.employee_management.entity.Dependent;
import com.example.employee_management.service.DependentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees/{empId}/dependents")
public class DependentController {

    private final DependentService dependentService;
    private final ModelMapper modelMapper;

    @Autowired
    public DependentController(DependentService dependentService, ModelMapper modelMapper) {
        this.dependentService = dependentService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<DependentDTO>> getDependentsByEmployeeId(@PathVariable String empId) {
        List<DependentDTO> dependents = dependentService.getDependentsByEmployeeId(empId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dependents);
    }

    @GetMapping("/{dependentsId}")
    public ResponseEntity<DependentDTO> getDependentById(
            @PathVariable String empId,
            @PathVariable String dependentsId) {
        Dependent dependent = dependentService.getDependentByIdAndEmployeeId(dependentsId, empId);
        return ResponseEntity.ok(convertToDto(dependent));
    }

    @PostMapping
    public ResponseEntity<DependentDTO> addDependent(
            @PathVariable String empId,
            @RequestBody DependentDTO dependentDTO) {
        Dependent dependent = convertToEntity(dependentDTO);
        Dependent createdDependent = dependentService.addDependent(empId, dependent);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(createdDependent));
    }

    @PutMapping("/{dependentsId}")
    public ResponseEntity<DependentDTO> updateDependent(
            @PathVariable String empId,
            @PathVariable String dependentsId,
            @RequestBody DependentDTO dependentDTO) {
        Dependent dependentDetails = convertToEntity(dependentDTO);
        Dependent updatedDependent = dependentService.updateDependent(empId, dependentsId, dependentDetails);
        return ResponseEntity.ok(convertToDto(updatedDependent));
    }

    @DeleteMapping("/{dependentsId}")
    public ResponseEntity<Void> deleteDependent(
            @PathVariable String empId,
            @PathVariable String dependentsId) {
        dependentService.deleteDependent(empId, dependentsId);
        return ResponseEntity.noContent().build();
    }

    private DependentDTO convertToDto(Dependent dependent) {
        DependentDTO dto = modelMapper.map(dependent, DependentDTO.class);
        if (dependent.getEmployee() != null) {
            dto.setEmpId(dependent.getEmployee().getEmpId());
        }
        return dto;
    }

    private Dependent convertToEntity(DependentDTO dependentDTO) {
        Dependent dependent = modelMapper.map(dependentDTO, Dependent.class);
        // Additional custom mappings if needed
        return dependent;
    }
}