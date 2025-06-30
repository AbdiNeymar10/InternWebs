package com.example.employee_management.repository;

import com.example.employee_management.entity.HR_Rank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface HR_RankRepository extends JpaRepository<HR_Rank, Long> {
    List<HR_Rank> findByIcfIdAndJobGradeId(Long icfId, Long jobGradeId);
}