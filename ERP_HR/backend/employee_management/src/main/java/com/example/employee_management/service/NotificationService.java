// package com.example.employee_management.service;

// import com.example.employee_management.dto.EmailNotificationRequestDTO;
// import com.example.employee_management.repository.EmployeeRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// @Service
// public class NotificationService {

// private static final Logger LOGGER =
// LoggerFactory.getLogger(NotificationService.class);

// private final EmailService emailService;
// // private final EmployeeRepository employeeRepository; // To fetch employee
// // details if needed

// @Value("${notification.recipient.email}") // Read from application.properties
// private String defaultNotificationRecipient;

// @Autowired
// public NotificationService(EmailService emailService, EmployeeRepository
// employeeRepository) {
// this.emailService = emailService;
// // this.employeeRepository = employeeRepository;
// }

// public void sendLeaveSubmissionNotification(EmailNotificationRequestDTO
// details) {
// String subject = "New Leave Request Submitted - " +
// details.getEmployeeName();
// String text = String.format(
// "A new leave request has been submitted by %s (ID: %s).\n\n" +
// "Leave Type: %s\n" +
// "Start Date: %s\n" +
// "End Date: %s\n" +
// "Requested Days: %s\n" +
// "Description: %s\n\n" +
// "Please review this request in the system.",
// details.getEmployeeName(),
// details.getEmployeeId(),
// details.getLeaveTypeName(),
// details.getLeaveStart(),
// details.getLeaveEnd(),
// details.getRequestedDays().toString(),
// details.getDescription() != null ? details.getDescription() : "N/A");

// // Send to a default recipient (e.g., HR admin)
// if (defaultNotificationRecipient != null &&
// !defaultNotificationRecipient.isEmpty()) {
// emailService.sendSimpleMessage(defaultNotificationRecipient, subject, text);
// } else {
// LOGGER.warn("Default notification recipient email is not configured.");
// }

// // Optionally, send a confirmation to the employee if their email is
// available
// // This requires the Employee entity to have an email field.
// // For now, we'll assume it's not there.
// /*
// * Optional<Employee> employeeOptional =
// * employeeRepository.findByEmpId(details.getEmployeeId());
// * if (employeeOptional.isPresent() && employeeOptional.get().getEmail() !=
// * null) {
// * String employeeSubject = "Your Leave Request Has Been Submitted";
// * String employeeText = String.format(
// * "Dear %s,\n\nYour leave request for %s from %s to %s has been successfully
// submitted.\n"
// * +
// * "You will be notified once it has been processed.\n\n" +
// * "Details:\n" +
// * "Leave Type: %s\n" +
// * "Requested Days: %s\n" +
// * "Description: %s\n\n" +
// * "Thank you.",
// * details.getEmployeeName(),
// * details.getLeaveTypeName(),
// * details.getLeaveStart(),
// * details.getLeaveEnd(),
// * details.getLeaveTypeName(),
// * details.getRequestedDays().toString(),
// * details.getDescription() != null ? details.getDescription() : "N/A"
// * );
// * emailService.sendSimpleMessage(employeeOptional.get().getEmail(),
// * employeeSubject, employeeText);
// * } else {
// * LOGGER.
// * warn("Could not send confirmation email to employee {}: Email not found or
// employee not found."
// * , details.getEmployeeId());
// * }
// */
// }

// // You can add other notification methods here, e.g., for leave
// // approval/rejection
// public void sendLeaveDecisionNotification(String toEmail, String
// employeeName, String leaveType, String decision,
// String remark) {
// String subject = "Update on Your Leave Request - " + leaveType;
// String text = String.format(
// "Dear %s,\n\n" +
// "Your leave request for %s has been %s.\n" +
// (remark != null && !remark.isEmpty() ? "Remark: " + remark + "\n\n" : "\n") +
// "Please log in to the system for more details.\n\n" +
// "Thank you.",
// employeeName,
// leaveType,
// decision.toLowerCase());
// emailService.sendSimpleMessage(toEmail, subject, text);
// }
// }