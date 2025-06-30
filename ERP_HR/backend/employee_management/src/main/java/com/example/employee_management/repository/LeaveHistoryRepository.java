package com.example.employee_management.repository;

import com.example.employee_management.entity.Employee;
import com.example.employee_management.entity.LeaveHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveHistoryRepository extends JpaRepository<LeaveHistory, Long> {

    // Query by the 'empId' field of the nested 'employee' object
    // This is used by LeaveHistoryService
    List<LeaveHistory> findByEmployeeEmpId(String empId);

    // If you need to filter by year as well:
    // The JPQL query ensures correct column names are used for the join and filter
    @Query("SELECT lh FROM LeaveHistory lh WHERE lh.employee.empId = :empId AND lh.year = :year")
    List<LeaveHistory> findByEmployeeEmpIdAndYear(@Param("empId") String empId, @Param("year") String year);

    boolean existsByEmployeeAndFromDateAndToDate(Employee employee, LocalDate fromDate, LocalDate toDate);

}