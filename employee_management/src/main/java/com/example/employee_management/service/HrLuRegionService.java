package com.example.employee_management.service;

import com.example.employee_management.dto.HrLuRegionDTO;
import com.example.employee_management.repository.HrLuRegionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HrLuRegionService {
    private final HrLuRegionRepository hrLuRegionRepository;

    @Transactional(readOnly = true)
    public List<HrLuRegionDTO> getAllRegions() {
        log.info("Fetching all regions from database");

        // First try JPQL query
        List<HrLuRegionDTO> regions = hrLuRegionRepository.findAllRegions();

        // If empty, try native query as fallback
        if (regions.isEmpty() || regions.get(0).getId() == null) {
            log.warn("JPQL query returned empty results, trying native query");
            regions = hrLuRegionRepository.findAllRegionsNative();
        }

        log.debug("Found {} regions", regions.size());
        regions.forEach(region ->
                log.trace("Region: ID={}, Name={}, Desc={}",
                        region.getId(), region.getRegionName(), region.getDescription())
        );

        return regions;
    }
}