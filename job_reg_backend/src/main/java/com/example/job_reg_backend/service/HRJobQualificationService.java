package com.example.job_reg_backend.service;

import com.example.job_reg_backend.model.HRJobQualification;
import com.example.job_reg_backend.model.EducationLevel;
import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.repository.HRJobQualificationRepository;
import com.example.job_reg_backend.repository.EducationLevelRepository;
import com.example.job_reg_backend.repository.HRJobTypeRepository;
import com.example.job_reg_backend.model.FieldOfStudy;
import com.example.job_reg_backend.repository.FieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRJobQualificationService {

    @Autowired
    private HRJobQualificationRepository repository;

    @Autowired
    private EducationLevelRepository educationLevelRepository;

    @Autowired
    private HRJobTypeRepository jobTypeRepository;

    @Autowired
    private FieldOfStudyRepository fieldOfStudyRepository;

    public List<HRJobQualification> getAllQualifications() {
        return repository.findAll();
    }

    public Optional<HRJobQualification> getQualificationById(Long id) {
        return repository.findById(id);
    }

    public HRJobQualification saveQualification(HRJobQualification qualification) {
        // Ensure the EducationLevel is properly set
        if (qualification.getEducationLevel() != null && qualification.getEducationLevel().getId() != null) {
            EducationLevel educationLevel = educationLevelRepository.findById(qualification.getEducationLevel().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + qualification.getEducationLevel().getId()));
            qualification.setEducationLevel(educationLevel);
        }

        // Ensure the HRJobType is properly set
        if (qualification.getJobType() != null && qualification.getJobType().getId() != null) {
            HRJobType jobType = jobTypeRepository.findById(qualification.getJobType().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid JobType ID: " + qualification.getJobType().getId()));
            qualification.setJobType(jobType);
        }
        // Ensure the FieldOfStudy is properly set
        if (qualification.getFieldOfStudy() != null && qualification.getFieldOfStudy().getId() != null) {
            FieldOfStudy fieldOfStudy = fieldOfStudyRepository.findById(qualification.getFieldOfStudy().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid FieldOfStudy ID: " + qualification.getFieldOfStudy().getId()));
            qualification.setFieldOfStudy(fieldOfStudy);
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