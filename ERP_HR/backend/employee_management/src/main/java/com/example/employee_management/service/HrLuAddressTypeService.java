package com.example.employee_management.service;

import com.example.employee_management.dto.HrLuAddressTypeDTO;
import com.example.employee_management.repository.HrLuAddressTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HrLuAddressTypeService {
    private final HrLuAddressTypeRepository hrLuAddressTypeRepository;

    @Transactional(readOnly = true)
    public List<HrLuAddressTypeDTO> getAllAddressTypes() {
        log.info("Fetching all address types from database");

        // First try JPQL query
        List<HrLuAddressTypeDTO> addressTypes = hrLuAddressTypeRepository.findAllAddressTypes();

        // If empty, try native query as fallback
        if (addressTypes.isEmpty() || addressTypes.get(0).getId() == null) {
            log.warn("JPQL query returned empty results, trying native query");
            addressTypes = hrLuAddressTypeRepository.findAllAddressTypesNative();
        }

        log.debug("Found {} address types", addressTypes.size());
        addressTypes.forEach(type ->
                log.trace("AddressType: ID={}, Type={}, Desc={}",
                        type.getId(), type.getAddressType(), type.getDescription())
        );

        return addressTypes;
    }
}