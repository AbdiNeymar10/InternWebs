package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLuLeaveYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HrLuLeaveYearRepository extends JpaRepository<HrLuLeaveYear, Long> {
    Optional<HrLuLeaveYear> findByLyear(String lyear);
}