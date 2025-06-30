package com.example.employee_management.repository;

import com.example.employee_management.entity.FieldOf_Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FieldOf_StudyRepository extends JpaRepository<FieldOf_Study, Long> {
FieldOf_Study findByName(String name);
}