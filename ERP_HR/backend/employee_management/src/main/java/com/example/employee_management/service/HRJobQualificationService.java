package com.example.employee_management.service;

import com.example.employee_management.entity.HRJobQualification;
import com.example.employee_management.entity.Education_Level;
import com.example.employee_management.entity.HRJob_Type;
import com.example.employee_management.repository.HRJobQualificationRepository;
import com.example.employee_management.repository.Education_LevelRepository;
import com.example.employee_management.repository.HRJob_TypeRepository;
//import com.example.employee_management.entity.FieldOfStudy;
//import com.example.employee_management.repository.FieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRJobQualificationService {

    @Autowired
    private HRJobQualificationRepository repository;

    @Autowired
    private Education_LevelRepository educationLevelRepository;

    @Autowired
    private HRJob_TypeRepository jobTypeRepository;

    //@Autowired
    //private FieldOfStudyRepository fieldOfStudyRepository;

    public List<HRJobQualification> getAllQualifications() {
        return repository.findAll();
    }

    public Optional<HRJobQualification> getQualificationById(Long id) {
        return repository.findById(id);
    }

    public HRJobQualification saveQualification(HRJobQualification qualification) {
        // Ensure the EducationLevel is properly set
        if (qualification.getEducationLevel() != null && qualification.getEducationLevel().getId() != null) {
            Education_Level educationLevel = educationLevelRepository.findById(qualification.getEducationLevel().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + qualification.getEducationLevel().getId()));
            qualification.setEducationLevel(educationLevel);
        }

        if (qualification.getJobType() != null && qualification.getJobType().getId() != null) {
            HRJob_Type jobType = jobTypeRepository.findById(qualification.getJobType().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid JobType ID: " + qualification.getJobType().getId()));
            qualification.setJobType(jobType);
        }

        return repository.save(qualification);
    }

    public void deleteQualification(Long id) {
        repository.deleteById(id);
    }

    public Optional<HRJobQualification> getQualificationByQualification(String qualification) {
        return repository.findByQualification(qualification);
    }
}