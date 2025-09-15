package com.example.employee_management.repository;

import com.example.employee_management.entity.HrEmployee;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrEmployeeRepository extends JpaRepository<HrEmployee, String> {

    @EntityGraph(attributePaths = {
            "photo", "department", "payGrade", "position", "nationality", "nation",
            "title", "religion", "employmentType", "recruitmentType", "jobResponsibility",
            "jobType", "jobFamily", "branch", "icf"
    })

    @Query("SELECT e FROM HrEmployee e WHERE e.empId = :empId")
    HrEmployee findEmployeeWithAllRelations(@Param("empId") String empId);

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithPayGrade(@Param("empId") String empId);

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.jobTypeDetail d LEFT JOIN FETCH d.jobType jt LEFT JOIN FETCH jt.jobTitle LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithJobTypeAndPayGrade(@Param("empId") String empId);

    @Query("SELECT e.photo FROM HrEmployee e WHERE e.empId = :empId")
    byte[] getEmployeePhoto(@Param("empId") String empId);

    @Modifying
    @Query("UPDATE HrEmployee e SET e.photo = :photo WHERE e.empId = :empId")
    void updateEmployeePhoto(@Param("empId") String empId, @Param("photo") byte[] photo);

    List<HrEmployee> findByDepartment_DeptId(Long deptId);

    List<HrEmployee> findByDepartment_DepNameContaining(String depName);

    List<HrEmployee> findByPayGrade_PayGradeId(Long payGradeId);

    @Query("SELECT e FROM HrEmployee e WHERE e.empId LIKE %:query% OR lower(e.firstName) LIKE lower(concat('%', :query, '%')) OR lower(e.lastName) LIKE lower(concat('%', :query, '%'))")
    List<HrEmployee> findByEmpIdOrNameContaining(@Param("query") String query);
}
