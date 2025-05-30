package com.example.job_reg_backend.controller;

import com.example.job_reg_backend.model.HRJobQualification;
import com.example.job_reg_backend.model.HRLuIcf;
import com.example.job_reg_backend.model.EducationLevel;
import com.example.job_reg_backend.model.HRJobType;
//import com.example.job_reg_backend.model.HRJobTypeDetail;
import com.example.job_reg_backend.model.JobType;
import com.example.job_reg_backend.service.HRJobQualificationService;
import com.example.job_reg_backend.repository.HRLuIcfRepository;
import com.example.job_reg_backend.repository.JobTypeRepository;
import com.example.job_reg_backend.repository.EducationLevelRepository;
import com.example.job_reg_backend.repository.HRJobQualificationRepository;
import com.example.job_reg_backend.repository.HRJobTypeRepository;
import com.example.job_reg_backend.repository.HRJobTypeDetailRepository;
import com.example.job_reg_backend.model.FieldOfStudy;
import com.example.job_reg_backend.repository.FieldOfStudyRepository;
import com.example.job_reg_backend.model.HRFieldOfStudy;
import com.example.job_reg_backend.repository.HRFieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.repository.query.Param; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.Objects;

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

    @Autowired
    private HRJobTypeDetailRepository jobTypeDetailRepository;

    @Autowired
    private HRJobQualificationRepository repository;

    @Autowired
    private HRFieldOfStudyRepository hrFieldOfStudyRepository;

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

    return service.saveQualification(qualification);
}

   @PostMapping("/bulk")
public ResponseEntity<?> saveQualifications(@RequestBody List<HRJobQualification> qualifications) {
    try {
        List<HRJobQualification> savedQualifications = qualifications.stream()
            .map(qualification -> {
                try {
                    HRJobQualification savedQ;
                    if (qualification.getId() != null && repository.existsById(qualification.getId())) {
                        // Update existing
                        HRJobQualification existingQ = repository.findById(qualification.getId()).get();
                        existingQ.setJobType(qualification.getJobType());
                        existingQ.setEducationLevel(qualification.getEducationLevel());
                        existingQ.setKeyCompetency(qualification.getKeyCompetency());
                        existingQ.setKnowledge(qualification.getKnowledge());
                        existingQ.setSkill(qualification.getSkill());
                        existingQ.setMinExperience(qualification.getMinExperience());
                        existingQ.setQualification(qualification.getQualification());
                        savedQ = repository.save(existingQ);
                    } else {
                        // Treat as new record
                        qualification.setId(null); 
                        savedQ = repository.save(qualification);
                    }
                    
                    hrFieldOfStudyRepository.deleteByJobQualificationId(savedQ.getId());

                    // Add new links
                    if (qualification.getFieldsOfStudy() != null) {
                        for (String fieldName : qualification.getFieldsOfStudy()) {
                            FieldOfStudy field = fieldOfStudyRepository.findByName(fieldName);
                            if (field != null) {
                                HRFieldOfStudy link = new HRFieldOfStudy();
                                link.setJobQualification(savedQ);
                                link.setFieldOfStudy(field);
                                hrFieldOfStudyRepository.save(link);
                            }
                        }
                    }

                    return savedQ;
                } catch (Exception ex) {
                    ex.printStackTrace();
                    return null; // Skip faulty records
                }
            })
            .filter(Objects::nonNull)
            .toList();

        return ResponseEntity.ok(savedQualifications);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"Error saving qualifications: " + e.getMessage() + "\"}");
    }
}

    @PutMapping("/{id}")
    public ResponseEntity<HRJobQualification> updateQualification(
    @PathVariable Long id,
    @RequestBody HRJobQualification updatedQualification
) {
    Optional<HRJobQualification> existing = repository.findById(id);
    if (existing.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    updatedQualification.setId(id);
    // Set education level and job type as in create
    if (updatedQualification.getEducationLevel() != null && updatedQualification.getEducationLevel().getId() != null) {
        EducationLevel educationLevel = educationLevelRepository.findById(updatedQualification.getEducationLevel().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + updatedQualification.getEducationLevel().getId()));
        updatedQualification.setEducationLevel(educationLevel);
    }
    if (updatedQualification.getJobType() != null && updatedQualification.getJobType().getId() != null) {
        HRJobType jobType = hrJobTypeRepository.findById(updatedQualification.getJobType().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Job Type ID: " + updatedQualification.getJobType().getId()));
        updatedQualification.setJobType(jobType);
    }
    HRJobQualification saved = repository.save(updatedQualification);
    return ResponseEntity.ok(saved);
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

@GetMapping("/by-job-title-and-icf-value")
public ResponseEntity<List<HRJobQualification>> getByJobTitleAndIcfValue(
    @RequestParam Long jobTypeId,
    @RequestParam String icfValue
) {
    //  Find ICF ID by value
    List<HRLuIcf> icfs = icfRepository.findAll();
    HRLuIcf icf = icfs.stream()
        .filter(i -> i.getIcf().equalsIgnoreCase(icfValue))
        .findFirst()
        .orElse(null);

    if (icf == null) {
        return ResponseEntity.ok(List.of());
    }

    //  Check if HR_JOB_TYPE_DETAIL has a row with jobTypeId and icfId
    boolean exists = jobTypeDetailRepository.findAll().stream()
        .anyMatch(d -> d.getJobType() != null && d.getJobType().getId().equals(jobTypeId)
            && d.getIcf() != null && d.getIcf().getId().equals(icf.getId()));

    if (!exists) {
        return ResponseEntity.ok(List.of());
    }

    //  Fetch qualifications by jobTypeId
    List<HRJobQualification> qualifications = repository.findByJobTypeId(jobTypeId);

// For each qualification, fetch its fields of study from HR_FIELD_OF_STUDY
    for (HRJobQualification qualification : qualifications) {
    List<HRFieldOfStudy> fieldLinks = hrFieldOfStudyRepository.findByJobQualificationId(qualification.getId());
    List<String> fieldNames = fieldLinks.stream()
        .map(f -> f.getFieldOfStudy() != null ? f.getFieldOfStudy().getName() : null)
        .filter(java.util.Objects::nonNull)
        .collect(Collectors.toList());
    qualification.setFieldsOfStudy(fieldNames);
}

    return ResponseEntity.ok(qualifications);
}
}
