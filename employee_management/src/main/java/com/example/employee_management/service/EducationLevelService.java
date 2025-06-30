package com.example.employee_management.service;

import com.example.employee_management.entity.EducationLevel;
import com.example.employee_management.repository.EducationLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationLevelService {

    @Autowired
    private EducationLevelRepository repo;

    public List<EducationLevel> getAll() {
        return repo.findAll();
    }
}