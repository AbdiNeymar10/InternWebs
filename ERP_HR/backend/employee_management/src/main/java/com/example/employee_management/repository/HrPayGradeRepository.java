package com.example.employee_management.repository;

import com.example.employee_management.dto.PayGradeStepDto;
import com.example.employee_management.entity.HrPayGrad;
import com.example.employee_management.entity.HrRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface HrPayGradeRepository extends JpaRepository<HrPayGrad, Long> {

    @Query("SELECT p FROM HrPayGrad p WHERE p.rankId = :rankId")
    List<HrPayGrad> findByRankId(@Param("rankId") HrRank rankId);

    @Query("SELECT p FROM HrPayGrad p WHERE p.rankId = :rankId AND p.stepNo = :stepNo")
    Optional<HrPayGrad> findByRankIdAndStepNo(@Param("rankId") HrRank rankId,
                                              @Param("stepNo") String stepNo);
    // src/main/java/com/example/employee_management/repository/HrPayGradeRepository.java
    @Query("SELECT new com.example.employee_management.dto.PayGradeStepDto(p.salary, p.stepNo) FROM HrPayGrad p WHERE p.rankId.rankId = :rankId")
    List<PayGradeStepDto> findSalaryAndStepNoByRankId(@Param("rankId") Long rankId);
}