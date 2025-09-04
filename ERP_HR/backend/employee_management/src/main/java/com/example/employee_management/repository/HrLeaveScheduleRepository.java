// In: com.example.employee_management.repository.HrLeaveScheduleRepository.java

package com.example.employee_management.repository;

import com.example.employee_management.entity.HrLeaveSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HrLeaveScheduleRepository extends JpaRepository<HrLeaveSchedule, Long> {

    List<HrLeaveSchedule> findByEmployeeIdAndLeaveYearId(String employeeId, Long leaveYearId);

    /**
     * Finds all schedules and eagerly fetches their associated details in a single query
     * to prevent the N+1 problem.
     * @return A list of schedules with their details initialized.
     */
    @Query("SELECT s FROM HrLeaveSchedule s LEFT JOIN FETCH s.scheduleDetails")
    List<HrLeaveSchedule> findAllWithDetails();
}