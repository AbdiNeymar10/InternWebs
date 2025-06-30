package com.example.employee_management.service;

import com.example.employee_management.dto.ExperienceDTO;
import com.example.employee_management.entity.Experience;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.ExperienceRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExperienceService {
    private final ExperienceRepository experienceRepository;
    private final HrEmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public List<ExperienceDTO> getExperiencesByEmployeeId(String employeeId) {
        log.info("Fetching experiences for employeeId: {}", employeeId);
        try {
            List<Experience> experiences = experienceRepository.findByEmployee_EmpId(employeeId);
            return experiences.stream()
                    .map(experience -> modelMapper.map(experience, ExperienceDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching experiences for employeeId {}: {}", employeeId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch experiences from database", e);
        }
    }

    @Transactional(readOnly = true)
    public ExperienceDTO getExperienceById(Long id) {
        log.info("Fetching experience by id: {}", id);
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Experience not found with id: {}", id);
                    return new RuntimeException("Experience not found with id: " + id);
                });
        return modelMapper.map(experience, ExperienceDTO.class);
    }

    @Transactional
    public ExperienceDTO createExperience(ExperienceDTO experienceDTO) {
        log.info("Creating new experience for employeeId: {}", experienceDTO.getEmployeeId());
        try {
            HrEmployee employee = employeeRepository.findById(experienceDTO.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + experienceDTO.getEmployeeId()));
            Experience experience = modelMapper.map(experienceDTO, Experience.class);
            experience.setId(null); // Ensure ID is null for new entity
            experience.setEmployee(employee);
            Experience savedExperience = experienceRepository.save(experience);
            log.info("Successfully created experience with id: {}", savedExperience.getId());
            return modelMapper.map(savedExperience, ExperienceDTO.class);
        } catch (Exception e) {
            log.error("Failed to create experience for employeeId {}: {}", experienceDTO.getEmployeeId(), e.getMessage(), e);
            throw new RuntimeException("Failed to create experience: " + e.getMessage(), e);
        }
    }

    @Transactional
    public ExperienceDTO updateExperience(Long id, ExperienceDTO experienceDTO) {
        log.info("Updating experience with id: {} for employeeId: {}", id, experienceDTO.getEmployeeId());
        try {
            Experience existingExperience = experienceRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Experience not found for update with id: {}", id);
                        return new RuntimeException("Experience not found with id: " + id + " for update.");
                    });
            HrEmployee employee = employeeRepository.findById(experienceDTO.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + experienceDTO.getEmployeeId()));
            modelMapper.map(experienceDTO, existingExperience);
            existingExperience.setId(id);
            existingExperience.setEmployee(employee);
            Experience updatedExperience = experienceRepository.save(existingExperience);
            log.info("Successfully updated experience with id: {}", updatedExperience.getId());
            return modelMapper.map(updatedExperience, ExperienceDTO.class);
        } catch (RuntimeException e) {
            log.error("Failed to update experience with id {}: {}", id, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error updating experience with id {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update experience: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteExperience(Long id) {
        log.info("Deleting experience with id: {}", id);
        try {
            if (!experienceRepository.existsById(id)) {
                log.warn("Experience not found for deletion with id: {}", id);
                throw new RuntimeException("Experience not found with id: " + id + " for deletion.");
            }
            experienceRepository.deleteById(id);
            log.info("Successfully deleted experience with id: {}", id);
        } catch (RuntimeException e) {
            log.error("Failed to delete experience with id {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error deleting experience with id {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete experience: " + e.getMessage(), e);
        }
    }
}