package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuPositionName;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.HrLuPositionNameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
// import java.util.Optional;

@Service
public class HrLuPositionNameService {

    private final HrLuPositionNameRepository repository;

    @Autowired
    public HrLuPositionNameService(HrLuPositionNameRepository repository) {
        this.repository = repository;
    }

    public List<HrLuPositionName> getAllPositions() {
        return repository.findAll();
    }

    public HrLuPositionName getPositionById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with id: " + id));
    }

    public HrLuPositionName createPosition(HrLuPositionName position) {
        return repository.save(position);
    }

    public HrLuPositionName updatePosition(Long id, HrLuPositionName positionDetails) {
        return repository.findById(id)
                .map(position -> {
                    position.setName(positionDetails.getName());
                    position.setSalary(positionDetails.getSalary());
                    return repository.save(position);
                })
                .orElseGet(() -> {
                    positionDetails.setId(id);
                    return repository.save(positionDetails);
                });
    }

    public void deletePosition(Long id) {
        repository.deleteById(id);
    }
}