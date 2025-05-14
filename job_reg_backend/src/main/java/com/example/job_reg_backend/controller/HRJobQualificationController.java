package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRJobQualification;
import com.example.job_reg_backend.model.HRLuIcf;
import com.example.job_reg_backend.model.EducationLevel;
import com.example.job_reg_backend.model.HRJobType;
import com.example.job_reg_backend.model.JobType;
import com.example.job_reg_backend.service.HRJobQualificationService;
import com.example.job_reg_backend.repository.HRLuIcfRepository;
import com.example.job_reg_backend.repository.JobTypeRepository;
import com.example.job_reg_backend.repository.EducationLevelRepository;
import com.example.job_reg_backend.repository.HRJobTypeRepository;
import com.example.job_reg_backend.model.FieldOfStudy;
import com.example.job_reg_backend.repository.FieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/qualifications")
@CrossOrigin(origins = "http://localhost:3000")
public class HRJobQualificationController {

    @Autowired
    private HRJobQualificationService service;

    @Autowired
    private HRLuIcfRepository icfRepository;

    @Autowired
    private JobTypeRepository jobTypeRepository;

    @Autowired
    private EducationLevelRepository educationLevelRepository;

    @Autowired
    private HRJobTypeRepository hrJobTypeRepository;

    @Autowired
    private FieldOfStudyRepository fieldOfStudyRepository;

    @GetMapping
    public List<HRJobQualification> getAllQualifications() {
        return service.getAllQualifications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HRJobQualification> getQualificationById(@PathVariable Long id) {
        Optional<HRJobQualification> qualification = service.getQualificationById(id);
        return qualification.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

   @PostMapping
public HRJobQualification createQualification(@RequestBody HRJobQualification qualification) {
    // Ensure the EducationLevel is properly set
    if (qualification.getEducationLevel() != null && qualification.getEducationLevel().getId() != null) {
        EducationLevel educationLevel = educationLevelRepository.findById(qualification.getEducationLevel().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + qualification.getEducationLevel().getId()));
        qualification.setEducationLevel(educationLevel);
    }

    // Ensure the HRJobType is properly set
    if (qualification.getJobType() != null && qualification.getJobType().getJobTitle() != null) {
        JobType jobTitle = jobTypeRepository.findById(qualification.getJobType().getJobTitle().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Job Title ID: " + qualification.getJobType().getJobTitle().getId()));
        HRJobType jobType = hrJobTypeRepository.findByJobTitle(jobTitle)
            .orElseGet(() -> {
                HRJobType newJobType = new HRJobType();
                newJobType.setJobTitle(jobTitle);
                return hrJobTypeRepository.save(newJobType); // Persist the new HRJobType
            });
        qualification.setJobType(jobType);
    }

    // Ensure the FieldOfStudy is properly set
    if (qualification.getFieldOfStudy() != null && qualification.getFieldOfStudy().getId() != null) {
        FieldOfStudy fieldOfStudy = fieldOfStudyRepository.findById(qualification.getFieldOfStudy().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid FieldOfStudy ID: " + qualification.getFieldOfStudy().getId()));
        qualification.setFieldOfStudy(fieldOfStudy);
    }

    return service.saveQualification(qualification);
}

@PostMapping("/bulk")
public ResponseEntity<?> createQualifications(@RequestBody List<HRJobQualification> qualifications) {
    try {
        List<HRJobQualification> savedQualifications = qualifications.stream().map(qualification -> {
            // Validate Job Type
            if (qualification.getJobType() != null && qualification.getJobType().getId() != null) {
                HRJobType jobType = hrJobTypeRepository.findById(qualification.getJobType().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Job Type ID: " + qualification.getJobType().getId()));
                System.out.println("Fetched Job Type: " + jobType); // Log the fetched job type
                System.out.println("Job Type ID: " + jobType.getId()); // Log the ID
                qualification.setJobType(jobType);
            } else {
                throw new IllegalArgumentException("Job Type is missing or invalid.");
            }

            // Validate Education Level
            if (qualification.getEducationLevel() != null && qualification.getEducationLevel().getId() != null) {
                EducationLevel educationLevel = educationLevelRepository.findById(qualification.getEducationLevel().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + qualification.getEducationLevel().getId()));
                qualification.setEducationLevel(educationLevel);
            } else {
                throw new IllegalArgumentException("EducationLevel is missing or invalid.");
            }

            // Validate Field of Study
            if (qualification.getFieldOfStudy() != null && qualification.getFieldOfStudy().getId() != null) {
                FieldOfStudy fieldOfStudy = fieldOfStudyRepository.findById(qualification.getFieldOfStudy().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid FieldOfStudy ID: " + qualification.getFieldOfStudy().getId()));
                qualification.setFieldOfStudy(fieldOfStudy);
            }

            return service.saveQualification(qualification);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(savedQualifications);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Validation error: " + e.getMessage());
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error saving qualifications: " + e.getMessage());
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQualification(@PathVariable Long id) {
        service.deleteQualification(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/icfs")
    public List<HRLuIcf> getAllICFs() {
        return icfRepository.findAll();
    }

    @GetMapping("/job-titles")
    public List<String> getAllJobTitles() {
        return jobTypeRepository.findAllJobTitles();
    }

    @GetMapping("/job-details")
    public ResponseEntity<HRJobQualification> getQualificationByQualification(@RequestParam String qualification) {
        Optional<HRJobQualification> qualificationData = service.getQualificationByQualification(qualification);
        return qualificationData.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}