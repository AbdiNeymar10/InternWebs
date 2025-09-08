package com.example.employee_management.repository;

import com.example.employee_management.entity.VacancyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VacancyTypeRepository extends JpaRepository<VacancyType, Long> {
    Optional<VacancyType> findByVacancyTypeId(Long vacancyTypeId);
}