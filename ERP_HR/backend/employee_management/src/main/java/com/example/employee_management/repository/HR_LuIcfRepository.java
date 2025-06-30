package com.example.employee_management.repository;

import com.example.employee_management.entity.HR_LuIcf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HR_LuIcfRepository extends JpaRepository<HR_LuIcf, Long> {
}
