package com.example.employee_management.service;

import com.example.employee_management.dto.TrainingDTO;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.entity.Training;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.repository.TrainingRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private HrEmployeeRepository employeeRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public List<TrainingDTO> getTrainingsByEmployeeId(String employeeId) {
        List<Training> trainings = trainingRepository.findByEmployee_EmpId(employeeId);
        return trainings.stream()
                .map(training -> modelMapper.map(training, TrainingDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public TrainingDTO createTraining(String employeeId, TrainingDTO trainingDTO) {
        HrEmployee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        Training training = modelMapper.map(trainingDTO, Training.class);
        training.setEmployee(employee);
        training.setId(null); // Ensure ID is null for new entity

        Training savedTraining = trainingRepository.save(training);
        return modelMapper.map(savedTraining, TrainingDTO.class);
    }

    @Transactional
    public TrainingDTO updateTraining(String employeeId, Long id, TrainingDTO trainingDTO) {
        Training existingTraining = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found with id: " + id));

        if (!existingTraining.getEmployeeId().equals(employeeId)) {
            throw new ResourceNotFoundException("Training with id " + id + " not found for employee: " + employeeId);
        }

        modelMapper.map(trainingDTO, existingTraining);
        existingTraining.setId(id);

        Training updatedTraining = trainingRepository.save(existingTraining);
        return modelMapper.map(updatedTraining, TrainingDTO.class);
    }

    @Transactional
    public void deleteTraining(String employeeId, Long id) {
        Training training = trainingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Training not found with id: " + id));

        if (!training.getEmployeeId().equals(employeeId)) {
            throw new ResourceNotFoundException("Training with id " + id + " not found for employee: " + employeeId);
        }

        trainingRepository.delete(training);
    }
}