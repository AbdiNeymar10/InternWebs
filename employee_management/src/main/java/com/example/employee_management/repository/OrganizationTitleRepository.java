package com.example.employee_management.repository;

import com.example.employee_management.entity.OrganizationTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationTitleRepository extends JpaRepository<OrganizationTitle, Long> {
}