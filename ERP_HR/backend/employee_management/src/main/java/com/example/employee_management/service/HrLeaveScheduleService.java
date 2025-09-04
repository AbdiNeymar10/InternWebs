package com.example.employee_management.service;

import com.example.employee_management.entity.HrLeaveSchedule;
import com.example.employee_management.entity.HrLeaveScheduleDet;
import com.example.employee_management.entity.NotificationTwo;
import com.example.employee_management.repository.HrLeaveScheduleRepository;
import com.example.employee_management.repository.HrLeaveScheduleDetRepository;
import com.example.employee_management.repository.NotificationTwoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HrLeaveScheduleService {

    private final HrLeaveScheduleRepository repository;
    private final HrLeaveScheduleDetRepository scheduleDetRepository;
    private final NotificationTwoRepository notificationRepository;

    @Autowired
    public HrLeaveScheduleService(HrLeaveScheduleRepository repository,
                                  HrLeaveScheduleDetRepository scheduleDetRepository,
                                  NotificationTwoRepository notificationRepository) {
        this.repository = repository;
        this.scheduleDetRepository = scheduleDetRepository;
        this.notificationRepository = notificationRepository;
    }

    public List<HrLeaveSchedule> findAll() {
        return repository.findAllWithDetails();
    }

    public Optional<HrLeaveSchedule> findById(Long id) {
        return repository.findById(id);
    }

    public HrLeaveSchedule save(HrLeaveSchedule schedule) {
        return repository.save(schedule);
    }

    public HrLeaveSchedule update(Long id, HrLeaveSchedule schedule) {
        return repository.findById(id)
                .map(existingSchedule -> {
                    existingSchedule.setLeaveYearId(schedule.getLeaveYearId());
                    existingSchedule.setEmployeeId(schedule.getEmployeeId());
                    existingSchedule.setStatus(schedule.getStatus());
                    existingSchedule.setDescription(schedule.getDescription());
                    return repository.save(existingSchedule);
                })
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<HrLeaveSchedule> findByEmployeeIdAndYear(String employeeId, Long leaveYearId) {
        return repository.findByEmployeeIdAndLeaveYearId(employeeId, leaveYearId);
    }

    @Transactional
    public HrLeaveSchedule rescheduleLeave(Long scheduleId, List<HrLeaveScheduleDet> details, String remark) {
        HrLeaveSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        for (HrLeaveScheduleDet detail : details) {
            schedule.getScheduleDetails().stream()
                    .filter(d -> d.getId().equals(detail.getId()))
                    .findFirst()
                    .ifPresent(existingDetail -> {
                        existingDetail.setLeaveMonth(detail.getLeaveMonth());
                        existingDetail.setDescription(detail.getDescription());
                        existingDetail.setPriority(detail.getPriority());
                        existingDetail.setStatus(detail.getStatus());
                        existingDetail.setNoDays(detail.getNoDays());
                    });
        }

        return repository.save(schedule);
    }

    @Transactional
    public void updateDetailStatus(Long scheduleId, String leaveMonth, String status, String remark) {
        HrLeaveSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        Optional<HrLeaveScheduleDet> detailToUpdate = schedule.getScheduleDetails().stream()
                .filter(detail -> detail.getLeaveMonth().equals(leaveMonth))
                .findFirst();

        if (detailToUpdate.isPresent()) {
            HrLeaveScheduleDet detail = detailToUpdate.get();
            detail.setStatus(status);
            scheduleDetRepository.save(detail);

            String message = status.equals("Approved")
                    ? String.format("Your leave request for %s has been approved.%s", leaveMonth, remark != null && !remark.isEmpty() ? " Remark: " + remark : "")
                    : String.format("Your leave request for %s has been rejected.%s", leaveMonth, remark != null && !remark.isEmpty() ? " Remark: " + remark : "");
            NotificationTwo notification = new NotificationTwo(schedule.getEmployeeId(), message);
            notificationRepository.save(notification);
        } else {
            throw new RuntimeException("Leave detail not found for schedule " + scheduleId + " and month " + leaveMonth);
        }
    }

    @Transactional
    public HrLeaveScheduleDet rescheduleSingleDetail(Long scheduleId, String leaveMonth, HrLeaveScheduleDet updatedDetail) {
        HrLeaveSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        Optional<HrLeaveScheduleDet> detailToUpdate = schedule.getScheduleDetails().stream()
                .filter(detail -> detail.getLeaveMonth().equals(leaveMonth))
                .findFirst();

        if (detailToUpdate.isPresent()) {
            HrLeaveScheduleDet detail = detailToUpdate.get();
            detail.setLeaveMonth(updatedDetail.getLeaveMonth());
            detail.setNoDays(updatedDetail.getNoDays());
            detail.setDescription(updatedDetail.getDescription());
            detail.setPriority(updatedDetail.getPriority());
            detail.setStatus("Pending"); // Reset status to Pending
            scheduleDetRepository.save(detail);

            String message = String.format("Your leave request for %s has been rescheduled and is pending approval.", updatedDetail.getLeaveMonth());
            NotificationTwo notification = new NotificationTwo(schedule.getEmployeeId(), message);
            notificationRepository.save(notification);

            return detail;
        } else {
            throw new RuntimeException("Leave detail not found for schedule " + scheduleId + " and month " + leaveMonth);
        }
    }
}