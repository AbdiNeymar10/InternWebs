package com.example.employee_management.service.impl;

import com.example.employee_management.entity.HrLuJobGrade;
import com.example.employee_management.repository.HrLuJobGradeRepository;
import com.example.employee_management.service.HrLuJobGradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrLuJobGradeServiceImpl implements HrLuJobGradeService {

    private final HrLuJobGradeRepository repository;

    @Autowired
    public HrLuJobGradeServiceImpl(HrLuJobGradeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<HrLuJobGrade> findAll() {
        return repository.findAll();
    }

    @Override
    public HrLuJobGrade findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Job Grade not found with ID: " + id));
    }

    @Override
    public HrLuJobGrade save(HrLuJobGrade jobGrade) {
        if (jobGrade.getId() != null) {
            HrLuJobGrade existingJobGrade = repository.findById(jobGrade.getId())
                .orElseThrow(() -> new RuntimeException("Job Grade not found with ID: " + jobGrade.getId()));
            existingJobGrade.setGrade(jobGrade.getGrade());
            existingJobGrade.setDescription(jobGrade.getDescription());
            return repository.save(existingJobGrade);
        }
        return repository.save(jobGrade);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Job Grade not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}