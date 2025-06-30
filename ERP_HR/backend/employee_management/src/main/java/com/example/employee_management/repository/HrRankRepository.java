
        package com.example.employee_management.repository;

import com.example.employee_management.entity.HrRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HrRankRepository extends JpaRepository<HrRank, Long> {
    @Query("SELECT r FROM HrRank r WHERE r.jobGradeId = :jobGradeId AND r.icfId = :icfId")
    List<HrRank> findByJobGradeIdAndIcfId(@Param("jobGradeId") Long jobGradeId,
                                          @Param("icfId") Long icfId);
}