package com.example.employee_management.controller;

import com.example.employee_management.entity.EmpExperience;
import com.example.employee_management.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/employees/{empId}/experiences")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpExperienceController {

    private static final Logger logger = LoggerFactory.getLogger(EmpExperienceController.class);
    private final EmpExperienceService empExperienceService;
    private final JdbcTemplate jdbcTemplate;
    private final HrLuEmploymentTypeService employmentTypeService;
    private final InstitutionService institutionService;
    private final OrganizationTitleService organizationTitleService;
    private final TerminationReasonService terminationReasonService;

    @Autowired
    public EmpExperienceController(
            EmpExperienceService empExperienceService,
            JdbcTemplate jdbcTemplate,
            HrLuEmploymentTypeService employmentTypeService,
            InstitutionService institutionService,
            OrganizationTitleService organizationTitleService,
            TerminationReasonService terminationReasonService) {
        this.empExperienceService = empExperienceService;
        this.jdbcTemplate = jdbcTemplate;
        this.employmentTypeService = employmentTypeService;
        this.institutionService = institutionService;
        this.organizationTitleService = organizationTitleService;
        this.terminationReasonService = terminationReasonService;
    }

    private Long generateUniqueId() {
        // Limit values to fit the DB column: EMP_EXPE_ID is NUMBER(10)
        final long MAX_ALLOWED = 9_999_999_999L; // 10 digits

        // Try a few common SQL forms for retrieving the next value from a sequence
        String[] sqlAttempts = new String[] {
                // Oracle (with DUAL)
                "SELECT HR_EMP_EXPERIENCE_SEQ.NEXTVAL FROM DUAL",
                // Postgres
                "SELECT nextval('HR_EMP_EXPERIENCE_SEQ')",
                // Some DBs allow calling the sequence directly
                "SELECT HR_EMP_EXPERIENCE_SEQ.NEXTVAL"
        };

        for (String sql : sqlAttempts) {
            try {
                Object result = jdbcTemplate.queryForObject(sql, Object.class);
                if (result instanceof Number) {
                    long val = ((Number) result).longValue();
                    if (val <= 0) {
                        logger.debug("Sequence returned non-positive value: {}", val);
                    }
                    if (val > MAX_ALLOWED) {
                        long reduced = (val % MAX_ALLOWED) + 1;
                        logger.warn("Sequence value {} exceeds {}. Reduced to {}", val, MAX_ALLOWED, reduced);
                        return reduced;
                    }
                    return val;
                }
            } catch (DataAccessException ex) {
                logger.debug("Sequence attempt failed (will try next): {} -> {}", sql, ex.getMessage());
            }
        }

        // Final fallback: generate an id that fits within NUMBER(10)
        long millis = System.currentTimeMillis();
        long randomPart = ThreadLocalRandom.current().nextLong(1, 1000);
        long generated = (millis % MAX_ALLOWED) + randomPart;
        // ensure strictly positive and within range
        generated = (generated <= 0) ? 1L : (generated > MAX_ALLOWED ? (generated % MAX_ALLOWED) + 1 : generated);
        logger.warn("Falling back to generated id for EmpExperience: {}", generated);
        return generated;
    }

    @PostMapping
    public ResponseEntity<?> saveExperience(@PathVariable String empId, @RequestBody EmpExperience empExperience) {
        try {
            empExperience.setEmpExpeId(generateUniqueId());
            empExperience.setEmpId(empId);
            if (empExperience.getEmploymentType() == null) {
                empExperience.setEmploymentType("UNKNOWN");
            }
            EmpExperience savedExperience = empExperienceService.saveExperience(empId, empExperience);
            return new ResponseEntity<>(savedExperience, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Failed to save experience for empId: " + empId, e);
            return new ResponseEntity<>("Failed to save experience: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExperience(@PathVariable String empId, @PathVariable Long id) {
        try {
            EmpExperience existingExperience = empExperienceService.getExperienceById(id);
            if (!existingExperience.getEmpId().equals(empId)) {
                return new ResponseEntity<>("Experience does not belong to employee: " + empId, HttpStatus.BAD_REQUEST);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("experience", existingExperience);
            response.put("referenceData", getReferenceData());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Experience not found with id: " + id, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getExperiencesByEmployee(@PathVariable String empId) {
        try {
            List<EmpExperience> experiences = empExperienceService.getExperiencesByEmployeeId(empId);
            Map<String, Object> response = new HashMap<>();
            response.put("experiences", experiences);
            response.put("referenceData", getReferenceData());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to fetch experiences for employee: " + empId,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperience(@PathVariable String empId, @PathVariable Long id,
            @RequestBody EmpExperience empExperience) {
        try {
            empExperience.setEmpId(empId);
            EmpExperience updatedExperience = empExperienceService.updateExperience(id, empExperience);
            return new ResponseEntity<>(updatedExperience, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update experience: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable String empId, @PathVariable Long id) {
        try {
            EmpExperience existingExperience = empExperienceService.getExperienceById(id);
            if (!existingExperience.getEmpId().equals(empId)) {
                return new ResponseEntity<>("Experience does not belong to employee: " + empId, HttpStatus.BAD_REQUEST);
            }
            empExperienceService.deleteExperience(id);
            return new ResponseEntity<>("Experience deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete experience: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Map<String, Object> getReferenceData() {
        Map<String, Object> referenceData = new HashMap<>();
        referenceData.put("employmentTypes", employmentTypeService.getAllEmploymentTypes());
        referenceData.put("institutions", institutionService.getAllInstitutions());
        referenceData.put("organizationTitles", organizationTitleService.getAllOrganizationTitles());
        referenceData.put("terminationReasons", terminationReasonService.getAllReasons());
        return referenceData;
    }
}