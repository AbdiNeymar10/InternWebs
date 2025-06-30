package com.example.employee_management.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.Locale;

@Getter
@Setter
@NoArgsConstructor
public class EmployeeDetailsDTO2 {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeDetailsDTO2.class);

    private String empId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String hiredDate;
    private String departmentName;
    private String directorateName;
    private String jobTitleName;
    private String employmentType;

    public String getInternalServiceYear() {
        return calculateAndFormatInternalServiceYear(this.hiredDate);
    }

    private String calculateAndFormatInternalServiceYear(String hiredDateStr) {
        if (hiredDateStr == null || hiredDateStr.trim().isEmpty()) {
            logger.warn("calculateAndFormatInternalServiceYear: hiredDateStr is null or empty.");
            return "N/A";
        }
        String trimmedDateStr = hiredDateStr.trim();
        logger.debug("calculateAndFormatInternalServiceYear: Attempting to parse hiredDateStr: '{}'", trimmedDateStr);

        LocalDate parsedGregorianHireDate = null;

        // Formatter for "dd-MMM-yy hh.mm.ss.SSSSSSSSS a" format, case-insensitive for month
        DateTimeFormatter oracleTimestampFormatter = new DateTimeFormatterBuilder()
                .parseCaseInsensitive()
                .appendPattern("dd-MMM-yy") // Handles "12-OCT-18" or "17-JUN-89"
                .optionalStart() // Makes the following time part optional
                .appendPattern(" ") // Space separator
                .appendPattern("hh.mm.ss.SSSSSSSSS") // Time part for 12-hour clock (01-12)
                .appendPattern(" ") // Space separator
                .appendPattern("a") // AM/PM marker
                .optionalEnd()
                .toFormatter(Locale.ENGLISH); // Use English locale for month names like OCT

        try {
            parsedGregorianHireDate = LocalDate.parse(trimmedDateStr, oracleTimestampFormatter);
            logger.debug("Initial parse with oracleTimestampFormatter: '{}' -> {}", trimmedDateStr, parsedGregorianHireDate);

            // Century correction for "yy" formats (e.g., "89" might parse as 2089)
            // If the parsed year is significantly in the future, assume it's 19xx instead of 20xx.
            // A common threshold is if the 2-digit year is > (current year % 100) + some buffer (e.g., 20 years),
            // or simply if the resulting year is > current year.
            if (parsedGregorianHireDate.getYear() > LocalDate.now().getYear() + 10) { // Heuristic: if parsed year is > current year + 10
                logger.debug("Applying century correction: {} is > current year + 10. Subtracting 100 years.", parsedGregorianHireDate.getYear());
                parsedGregorianHireDate = parsedGregorianHireDate.minusYears(100);
                logger.debug("Corrected parsedGregorianHireDate: {}", parsedGregorianHireDate);
            }

        } catch (DateTimeParseException e1) {
            logger.warn("Failed to parse with oracleTimestampFormatter: '{}'. Error: {}", trimmedDateStr, e1.getMessage());
            // Fallback to other formats if the primary parse fails
            try {
                if (trimmedDateStr.matches("\\d{4}-\\d{2}-\\d{2}.*")) { // YYYY-MM-DD format
                    parsedGregorianHireDate = LocalDate.parse(trimmedDateStr.split("T")[0].split(" ")[0], DateTimeFormatter.ISO_LOCAL_DATE);
                    logger.debug("Parsed as ISO_LOCAL_DATE (YYYY-MM-DD): '{}' -> {}", trimmedDateStr, parsedGregorianHireDate);
                } else if (trimmedDateStr.matches("\\d{4}")) { // YYYY format
                    // For a simple year string, create a LocalDate assuming start of that year for calculation
                    parsedGregorianHireDate = LocalDate.of(Integer.parseInt(trimmedDateStr), 1, 1);
                    logger.debug("Parsed as 4-digit year (YYYY): '{}' -> {}", trimmedDateStr, parsedGregorianHireDate);
                } else {
                    logger.warn("Unrecognized date format after primary attempt: '{}'", trimmedDateStr);
                    return "N/A - Invalid Date Format";
                }
            } catch (DateTimeParseException | NumberFormatException e2) {
                logger.error("Fallback parsing failed for hiredDateStr: '{}'. Error: {}", trimmedDateStr, e2.getMessage());
                return "N/A - Invalid Date Format";
            }
        }

        if (parsedGregorianHireDate == null) {
            logger.error("Could not parse hiredDateStr: '{}' into a LocalDate object after all attempts.", trimmedDateStr);
            return "N/A - Invalid Date Format";
        }

        LocalDate today = LocalDate.now();

        // Check if the (potentially century-corrected) hire date is in the future.
        if (parsedGregorianHireDate.isAfter(today)) {
            logger.warn("Corrected hire date {} is still after today {}. Original input: '{}'", parsedGregorianHireDate, today, trimmedDateStr);
            return "N/A - Check Hire Date";
        }

        // Calculate the full Gregorian period of service
        Period servicePeriod = Period.between(parsedGregorianHireDate, today);
        int yearsOfService = servicePeriod.getYears();
        int monthsOfService = servicePeriod.getMonths();
        // int daysOfService = servicePeriod.getDays(); // Available if needed

        logger.debug("Gregorian service period calculated: {} years, {} months, {} days. From hire date: {} to today: {}",
                yearsOfService, monthsOfService, servicePeriod.getDays(), parsedGregorianHireDate, today);

        // Formatting the output string
        StringBuilder result = new StringBuilder();
        boolean hasContent = false;

        if (yearsOfService > 0) {
            result.append(yearsOfService).append(yearsOfService == 1 ? " year" : " years");
            hasContent = true;
        }

        if (monthsOfService > 0) {
            if (hasContent) {
                result.append(", ");
            }
            result.append(monthsOfService).append(monthsOfService == 1 ? " month" : " months");
            hasContent = true;
        }

        // If service is less than a month (i.e., years and months are 0)
        if (!hasContent) {
            // This covers cases where hired today, or within the same month and year.
            // If daysOfService > 0, you could say "Less than a month"
            // For simplicity, if no years and no months, we'll show "0 months".
            return "0 months";
        }

        return result.toString();
    }

    public void setInternalServiceYear(String s) {
        // This field is derived.
    }
}