package com.example.employee_management.controller;

import com.example.employee_management.dto.TrainingDTO;
// import com.example.employee_management.entity.Training;
import com.example.employee_management.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// Ensure you are using jakarta.validation.Valid if using Spring Boot 3+
// import jakarta.validation.Valid;
// Or use javax.validation.Valid if using Spring Boot 2.x
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/employees/{employeeId}/trainings")
// Add CrossOrigin for local development if frontend is on port (e.g., 3000)
@CrossOrigin(origins = "http://localhost:3000") // Adjust port if needed
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    /**
     * Retrieves all training records for a specific employee.
     * 
     * @param employeeId The ID of the employee.
     * @return A list of TrainingDTOs.
     */
    @GetMapping
    public ResponseEntity<List<TrainingDTO>> getTrainingsByEmployeeId(
            @PathVariable String employeeId) {
        List<TrainingDTO> trainings = trainingService.getTrainingsByEmployeeId(employeeId);
        return ResponseEntity.ok(trainings);
    }

    /**
     * Creates a new training record for a specific employee.
     * Relies on TrainingService to handle setting the entity ID to null before
     * saving.
     * 
     * @param employeeId  The ID of the employee.
     * @param trainingDTO The training data transfer object.
     * @return The created TrainingDTO with its generated ID.
     */
    @PostMapping
    public ResponseEntity<TrainingDTO> createTraining(
            @PathVariable String employeeId,
            @Valid @RequestBody TrainingDTO trainingDTO) {
        // The TrainingService.createTraining method is responsible for
        // setting the underlying Training entity's ID to null before saving.
        TrainingDTO createdTraining = trainingService.createTraining(employeeId, trainingDTO);
        // Return 201 Created status for successful creation
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTraining);
    }

    /**
     * Updates an existing training record.
     * 
     * @param employeeId  The ID of the employee (potentially for
     *                    validation/scoping).
     * @param id          The ID of the training record to update.
     * @param trainingDTO The updated training data.
     * @return The updated TrainingDTO.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TrainingDTO> updateTraining(
            @PathVariable String employeeId,
            @PathVariable Long id,
            @Valid @RequestBody TrainingDTO trainingDTO) {
        // Consider adding logic here or in the service to ensure employeeId matches
        // the one associated with the training record 'id' for security/consistency.
        TrainingDTO updatedTraining = trainingService.updateTraining(employeeId, id, trainingDTO);
        return ResponseEntity.ok(updatedTraining);
    }

    /**
     * Deletes a specific training record.
     * 
     * @param employeeId The ID of the employee (potentially for
     *                   validation/scoping).
     * @param id         The ID of the training record to delete.
     * @return ResponseEntity with no content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(
            @PathVariable String employeeId,
            @PathVariable Long id) {
        // Consider adding logic here or in the service to ensure employeeId matches
        // the one associated with the training record 'id'.
        trainingService.deleteTraining(employeeId, id);
        return ResponseEntity.noContent().build(); // Standard practice for successful DELETE
    }
}
