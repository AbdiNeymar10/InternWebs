package com.example.employee_management.repository;

import com.example.employee_management.dto.HrLuRegionDTO;
import com.example.employee_management.entity.HrLuRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HrLuRegionRepository extends JpaRepository<HrLuRegion, Long> {

    @Query("SELECT new com.example.employee_management.dto.HrLuRegionDTO(r.id, r.regionName, r.description) " +
            "FROM HrLuRegion r ORDER BY r.regionName")
    List<HrLuRegionDTO> findAllRegions();

    // Add the missing method here:
    @Query(value = "SELECT id, region_name, description FROM hr_lu_region ORDER BY region_name", nativeQuery = true)
    List<HrLuRegionDTO> findAllRegionsNative();
}