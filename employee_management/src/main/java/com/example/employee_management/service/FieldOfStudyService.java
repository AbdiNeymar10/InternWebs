package com.example.employee_management.service;

import com.example.employee_management.entity.FieldOfStudy;
import com.example.employee_management.repository.FieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldOfStudyService {

    @Autowired
    private FieldOfStudyRepository repo;

    public List<FieldOfStudy> getAll() {
        return repo.findAll();
    }
}