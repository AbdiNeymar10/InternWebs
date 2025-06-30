package com.example.employee_management.repository;

import com.example.employee_management.dto.HrLuAddressTypeDTO;
import com.example.employee_management.entity.HrLuAddressType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HrLuAddressTypeRepository extends JpaRepository<HrLuAddressType, Long> {

    @Query("SELECT new com.example.employee_management.dto.HrLuAddressTypeDTO(at.id, at.addressType, at.description) " +
            "FROM HrLuAddressType at ORDER BY at.addressType")
    List<HrLuAddressTypeDTO> findAllAddressTypes();

    // Add the missing method here:
    @Query(value = "SELECT id, address_type, description FROM hr_lu_address_type ORDER BY address_type", nativeQuery = true)
    List<HrLuAddressTypeDTO> findAllAddressTypesNative();
}