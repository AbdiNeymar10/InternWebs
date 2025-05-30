package com.example.job_reg_backend.repository;

import com.example.job_reg_backend.model.HrEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrEmployeeRepository extends JpaRepository<HrEmployee, String> {

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.employmentType " +
            "LEFT JOIN FETCH e.department LEFT JOIN FETCH e.nation " +
            "LEFT JOIN FETCH e.nationality LEFT JOIN FETCH e.religion " +
            "LEFT JOIN FETCH e.recruitmentType LEFT JOIN FETCH e.jobTypeDetail d LEFT JOIN FETCH d.jobType jt LEFT JOIN FETCH jt.jobTitle " +
            "LEFT JOIN FETCH e.position LEFT JOIN FETCH e.branch " +
            "LEFT JOIN FETCH e.jobFamily LEFT JOIN FETCH e.icf " +
            "LEFT JOIN FETCH e.jobResponsibility " +
            "LEFT JOIN FETCH e.title " +
            "WHERE e.empId = :empId")
    HrEmployee findEmployeeWithAllRelations(@Param("empId") String empId);

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithPayGrade(@Param("empId") String empId);

    @Query("SELECT e FROM HrEmployee e LEFT JOIN FETCH e.jobTypeDetail d LEFT JOIN FETCH d.jobType jt LEFT JOIN FETCH jt.jobTitle LEFT JOIN FETCH e.payGrade WHERE e.empId = :empId")
    HrEmployee findEmployeeWithJobTypeAndPayGrade(@Param("empId") String empId);

    List<HrEmployee> findByNation_NationCode(Integer nationCode);

    List<HrEmployee> findByTitle_TitleId(Long titleId);

    List<HrEmployee> findByDepartment_DeptId(Long deptId);

    List<HrEmployee> findByDepartment_DepNameContaining(String depName);

    List<HrEmployee> findByPayGrade_PayGradeId(Long payGradeId);
}