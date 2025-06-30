package com.example.employee_management.repository;

import com.example.employee_management.entity.HrEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrEmployeeRepository extends JpaRepository<HrEmployee, String> {

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.department LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithAllRelations(String empId);

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithPayGrade(String empId);

     @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.jobTypeDetail d LEFT JOIN FETCH d.jobType jt LEFT JOIN FETCH jt.jobTitle LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithJobTypeAndPayGrade(@Param("empId") String empId);

    @Query("SELECT e.photo FROM HrEmployee e WHERE e.empId = :empId")
    byte[] getEmployeePhoto(String empId); // Changed from Blob to byte[]

    @Modifying
    @Query("UPDATE HrEmployee e SET e.photo = :photo WHERE e.empId = :empId")
    void updateEmployeePhoto(String empId, byte[] photo); // Changed from Blob to byte[]

    List<HrEmployee> findByDepartment_DeptId(Long deptId);

    List<HrEmployee> findByDepartment_DepNameContaining(String depName);

    List<HrEmployee> findByPayGrade_PayGradeId(Long payGradeId);

    @Query("SELECT e FROM HrEmployee e WHERE e.empId LIKE %:query% OR " +
            "CONCAT(COALESCE(e.firstName, ''), ' ', COALESCE(e.middleName, ''), ' ', COALESCE(e.lastName, '')) LIKE %:query%")
    List<HrEmployee> findByEmpIdOrNameContaining(String query);
}



