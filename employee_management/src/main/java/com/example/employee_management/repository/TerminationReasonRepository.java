package com.example.employee_management.repository;

import com.example.employee_management.entity.TerminationReason;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TerminationReasonRepository extends JpaRepository<TerminationReason, Long> {
}