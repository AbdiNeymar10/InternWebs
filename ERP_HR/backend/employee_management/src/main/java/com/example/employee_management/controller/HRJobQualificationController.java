package com.example.employee_management.controller;

import com.example.employee_management.entity.HRJobQualification;
import com.example.employee_management.entity.HR_LuIcf;
import com.example.employee_management.entity.Education_Level;
import com.example.employee_management.entity.HRJob_Type;
import com.example.employee_management.entity.Job_Type;
import com.example.employee_management.service.HRJobQualificationService;
import com.example.employee_management.repository.HR_LuIcfRepository;
import com.example.employee_management.repository.Job_TypeRepository;
import com.example.employee_management.repository.Education_LevelRepository;
import com.example.employee_management.repository.HRJobQualificationRepository;
import com.example.employee_management.repository.HRJob_TypeRepository;
import com.example.employee_management.repository.HRJob_TypeDetailRepository;
import com.example.employee_management.entity.FieldOf_Study;
import com.example.employee_management.repository.FieldOf_StudyRepository;
import com.example.employee_management.entity.HRFieldOfStudy;
import com.example.employee_management.repository.HRFieldOfStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    private HR_LuIcfRepository icfRepository;

    @Autowired
    private Job_TypeRepository jobTypeRepository;

    @Autowired
    private Education_LevelRepository educationLevelRepository;

    @Autowired
    private HRJob_TypeRepository hrJobTypeRepository;

    @Autowired
    private FieldOf_StudyRepository fieldOfStudyRepository;

    @Autowired
    private HRJob_TypeDetailRepository jobTypeDetailRepository;

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
    if (qualification.getEducationLevel() != null && qualification.getEducationLevel().getId() != null) {
        Education_Level educationLevel = educationLevelRepository.findById(qualification.getEducationLevel().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + qualification.getEducationLevel().getId()));
        qualification.setEducationLevel(educationLevel);
    }

    // Ensure the HRJobType is properly set
    if (qualification.getJobType() != null && qualification.getJobType().getJobTitle() != null) {
        Job_Type jobTitle = jobTypeRepository.findById(qualification.getJobType().getJobTitle().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid Job Title ID: " + qualification.getJobType().getJobTitle().getId()));
        HRJob_Type jobType = hrJobTypeRepository.findByJobTitle(jobTitle)
            .orElseGet(() -> {
                HRJob_Type newJobType = new HRJob_Type();
                newJobType.setJobTitle(jobTitle);
                return hrJobTypeRepository.save(newJobType); 
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
                        qualification.setId(null); 
                        savedQ = repository.save(qualification);
                    }
                    
                    hrFieldOfStudyRepository.deleteByJobQualificationId(savedQ.getId());

                    // Add new links
                    if (qualification.getFieldsOfStudy() != null) {
                        for (String fieldName : qualification.getFieldsOfStudy()) {
                            FieldOf_Study field = fieldOfStudyRepository.findByName(fieldName);
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
                    return null; 
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
        Education_Level educationLevel = educationLevelRepository.findById(updatedQualification.getEducationLevel().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid EducationLevel ID: " + updatedQualification.getEducationLevel().getId()));
        updatedQualification.setEducationLevel(educationLevel);
    }
    if (updatedQualification.getJobType() != null && updatedQualification.getJobType().getId() != null) {
        HRJob_Type jobType = hrJobTypeRepository.findById(updatedQualification.getJobType().getId())
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
    public List<HR_LuIcf> getAllICFs() {
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
    List<HR_LuIcf> icfs = icfRepository.findAll();
    HR_LuIcf icf = icfs.stream()
        .filter(i -> i.getIcf().equalsIgnoreCase(icfValue))
        .findFirst()
        .orElse(null);

    if (icf == null) {
        return ResponseEntity.ok(List.of());
    }

    boolean exists = jobTypeDetailRepository.findAll().stream()
        .anyMatch(d -> d.getJobType() != null && d.getJobType().getId().equals(jobTypeId)
            && d.getIcf() != null && d.getIcf().getId().equals(icf.getId()));

    if (!exists) {
        return ResponseEntity.ok(List.of());
    }

    List<HRJobQualification> qualifications = repository.findByJobTypeId(jobTypeId);

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
