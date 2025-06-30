package com.example.employee_management.service;

import com.example.employee_management.dto.PayGradeStepDto;
import com.example.employee_management.dto.SalaryStepDto;
import com.example.employee_management.entity.HrJobType;
import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.entity.HrRank;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.HrJobTypeRepository;
import com.example.employee_management.repository.HrPayGradeRepository;
import com.example.employee_management.repository.HrRankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SalaryService {

    private final HrJobTypeRepository jobTypeRepository;
    private final HrRankRepository rankRepository;
    private final HrPayGradeRepository payGradeRepository;

    @Autowired
    public SalaryService(
            HrJobTypeRepository jobTypeRepository,
            HrRankRepository rankRepository,
            HrPayGradeRepository payGradeRepository
    ) {
        this.jobTypeRepository = jobTypeRepository;
        this.rankRepository = rankRepository;
        this.payGradeRepository = payGradeRepository;
    }

    public List<HrPayGrad> getAllPayGrades() {
        return payGradeRepository.findAll();
    }

    public List<SalaryStepDto> getSalarySteps(Long jobTitleId, Long icfId) {
        HrJobType jobType;
        List<HrJobType> jobTypes = jobTypeRepository.findByJobTitle_Id(jobTitleId);
        if (jobTypes.isEmpty()) {
            throw new ResourceNotFoundException("Job title not found with id: " + jobTitleId);
        }
        jobType = jobTypes.get(0);

        List<HrRank> ranks = rankRepository.findByJobGradeIdAndIcfId(
                jobType.getJobGrade().getId(),
                icfId
        );

        if (ranks.isEmpty()) {
            throw new ResourceNotFoundException("No rank found for this job grade and ICF combination");
        }

        List<HrPayGrad> payGrades = new ArrayList<>();
        for (HrRank rank : ranks) {
            payGrades.addAll(payGradeRepository.findByRankId(rank));
        }

        return payGrades.stream()
                .map(pg -> new SalaryStepDto(
                        Integer.parseInt(pg.getStepNo()),
                        pg.getSalary()
                ))
                .collect(Collectors.toList());
    }

    public String getSalaryForStep(Long jobTitleId, Long icfId, Integer stepNo) {
        List<HrJobType> jobTypes = jobTypeRepository.findByJobTitle_Id(jobTitleId);
        if (jobTypes.isEmpty()) {
            throw new ResourceNotFoundException("Job title not found with id: " + jobTitleId);
        }
        HrJobType jobType = jobTypes.get(0);

        List<HrRank> ranks = rankRepository.findByJobGradeIdAndIcfId(
                jobType.getJobGrade().getId(),
                icfId
        );

        if (ranks.isEmpty()) {
            throw new ResourceNotFoundException("No rank found for this job grade and ICF combination");
        }
        HrRank targetRank = ranks.get(0);
        Optional<HrPayGrad> payGradeOpt = payGradeRepository.findByRankIdAndStepNo(
                targetRank,
                String.valueOf(stepNo)
        );
        HrPayGrad actualPayGrade = payGradeOpt.orElseThrow(() ->
                new ResourceNotFoundException("No salary found for step " + stepNo +
                        " for rank ID " + targetRank)
        );

        return actualPayGrade.getSalary();
    }
    // src/main/java/com/example/employee_management/service/SalaryService.java
    public List<PayGradeStepDto> getSalaryAndStepNoByRankId(Long rankId) {
        return payGradeRepository.findSalaryAndStepNoByRankId(rankId);
    }
}