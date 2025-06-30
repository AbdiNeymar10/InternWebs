package com.example.employee_management.repository;
import com.example.employee_management.entity.HrLuPositionName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HrLuPositionNameRepository extends JpaRepository<HrLuPositionName, Long> {
    // Custom queries can be added here
    // Example: List<HrLuPositionName> findByNameContaining(String name);
}
