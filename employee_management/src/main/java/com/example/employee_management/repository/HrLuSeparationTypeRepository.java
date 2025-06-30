package com.example.employee_management.repository;



import com.example.employee_management.entity.HrLuSeparationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrLuSeparationTypeRepository extends JpaRepository<HrLuSeparationType, String> {
    static List<HrLuSeparationType> findAllByOrderByDescriptionAsc() {
        return null;
    }
}
