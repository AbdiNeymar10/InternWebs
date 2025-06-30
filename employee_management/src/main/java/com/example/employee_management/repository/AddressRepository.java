package com.example.employee_management.repository;

import com.example.employee_management.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query(value = """
    SELECT 
        a.id, 
        a.EMP_ID, 
        a.ADD_TYPE, 
        a.WOREDA, 
        a.KEBELE, 
        a.TELEPHONE_OFFICE, 
        a.EMAIL, 
        a.POBOX, 
        a.MOBILE, 
        a.ZONEE, 
        a.KIFLE_KETEMA, 
        a.TELEPHONE_RESIDENCE, 
        a.HOUSENO, 
        a.REGION,
        r.ID, 
        r.REGION_NAME, 
        r.DESCRIPTION
    FROM HR_EMP_ADDRESS a 
    LEFT JOIN HR_LU_REGION r ON a.REGION = r.REGION_NAME 
    WHERE a.EMP_ID = :employeeId
    ORDER BY a.ADD_TYPE
    """, nativeQuery = true)
    List<Object[]> findAddressesWithRegionDetails(@Param("employeeId") String employeeId);

    List<Address> findByEmpId(String empId);
}