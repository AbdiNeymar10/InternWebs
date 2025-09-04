package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuLeaveType;
import com.example.employee_management.exception.ResourceNotFoundException; // You'll need to create this exception class
import com.example.employee_management.repository.HrLuLeaveTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrLuLeaveTypeService {

    private final HrLuLeaveTypeRepository repository;

    // The @Autowired annotation is not needed on constructors when there's only one.
    // Spring handles it automatically. This is cleaner.
    public HrLuLeaveTypeService(HrLuLeaveTypeRepository repository) {
        this.repository = repository;
    }

    public List<HrLuLeaveType> findAll() {
        return repository.findAll();
    }

    /**
     * Finds a leave type by its ID.
     * @param id The ID of the leave type.
     * @return The found HrLuLeaveType entity.
     * @throws ResourceNotFoundException if no leave type is found with the given ID.
     */
    public HrLuLeaveType findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveType not found with id: " + id));
    }

    /**
     * Saves a new leave type. The ID is expected to be null.
     * @param leaveType The entity to save.
     * @return The saved entity with its new ID.
     */
    public HrLuLeaveType save(HrLuLeaveType leaveType) {
        // The controller should ensure the ID is null before calling this.
        return repository.save(leaveType);
    }

    /**
     * Updates an existing leave type.
     * @param id The ID of the leave type to update.
     * @param leaveTypeDetails The new details for the leave type.
     * @return The updated entity.
     * @throws ResourceNotFoundException if the leave type to update is not found.
     */
    public HrLuLeaveType update(Long id, HrLuLeaveType leaveTypeDetails) {
        // First, find the existing entity. This will throw an exception if it doesn't exist.
        HrLuLeaveType existingLeaveType = findById(id);

        // Update the fields of the existing entity with the new details.
        existingLeaveType.setLeaveName(leaveTypeDetails.getLeaveName());
        existingLeaveType.setDescription(leaveTypeDetails.getDescription());
        existingLeaveType.setLeaveCode(leaveTypeDetails.getLeaveCode());
        existingLeaveType.setStatus(leaveTypeDetails.getStatus());
        // Add any other fields that should be updatable.

        return repository.save(existingLeaveType);
    }

    /**
     * Deletes a leave type by its ID.
     * @param id The ID of the leave type to delete.
     * @throws ResourceNotFoundException if the leave type to delete is not found.
     */
    public void deleteById(Long id) {
        // Check if the entity exists before trying to delete it.
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. LeaveType not found with id: " + id);
        }
        repository.deleteById(id);
    }
}