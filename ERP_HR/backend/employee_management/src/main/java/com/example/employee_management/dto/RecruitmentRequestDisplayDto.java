package com.example.employee_management.dto;

import com.example.employee_management.entity.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.Data;

import java.util.Map;

@Data
public class RecruitmentRequestDisplayDto {
    private Long recruitRequestId;
    private String gmRemark;
    private String recruitBatchCode;
    private String remark;
    private String requestStatus;
    private String requesterId;
    private String budgetYear;
    private String advertisementType;
    private String salary;
    private Long numOfEmps;

    private DepartmentInfo department;
    private JobCodeDetailInfo jobCodeDetail;
    private IcfInfo icf;
    private RecruitmentTypeInfo recruitmentType;

    // These fields will now be populated from the JSON in selectionRemark
    private String incrementStep;
    private EmploymentTypeInfo employmentType;

    @Data
    public static class DepartmentInfo {
        private Long deptId;
        private String depName;
    }

    @Data
    public static class JobCodeDetailInfo {
        private Long id;
        private HrJobTypeInfo hrJobType;
        private IcfInfo icf;
    }

    @Data
    public static class HrJobTypeInfo {
        private Long id;
        private HrLuJobTypeInfo jobTitle;
        private HrLuJobGradeInfo jobGrade;
    }

    @Data
    public static class HrLuJobTypeInfo {
        private Long id;
        private String jobTitle;
    }

    @Data
    public static class HrLuJobGradeInfo {
        private Long id;
        private String jobGrade;
    }

    @Data
    public static class IcfInfo {
        private Long id;
        private String icf;
    }

    @Data
    public static class RecruitmentTypeInfo {
        private String recruitmentType;
        private String description;
    }

    @Data
    public static class EmploymentTypeInfo {
        private Long id; // This might be null if only 'type' is stored in JSON
        private String type;
    }

    public static RecruitmentRequestDisplayDto fromEntity(RecruitmentRequest entity) {
        RecruitmentRequestDisplayDto dto = new RecruitmentRequestDisplayDto();
        dto.setRecruitRequestId(entity.getRecruitRequestId());
        dto.setGmRemark(entity.getGmRemark());
        dto.setRecruitBatchCode(entity.getRecruitBatchCode());
        dto.setRemark(entity.getRemark());
        dto.setRequestStatus(entity.getRequestStatus());
        dto.setRequesterId(entity.getRequesterId());
        dto.setBudgetYear(entity.getBudgetYear());
        dto.setAdvertisementType(entity.getAdvertisementType());
        dto.setSalary(entity.getSalary());
        dto.setNumOfEmps(entity.getNumOfEmps());

        if (entity.getDepartment() != null) {
            DepartmentInfo deptInfo = new DepartmentInfo();
            deptInfo.setDeptId(entity.getDepartment().getDeptId());
            deptInfo.setDepName(entity.getDepartment().getDepName());
            dto.setDepartment(deptInfo);
        }

        if (entity.getJobCodeDetail() != null) {
            JobCodeDetailInfo jcdInfo = new JobCodeDetailInfo();
            jcdInfo.setId(entity.getJobCodeDetail().getId());

            if (entity.getJobCodeDetail().getHrJobType() != null) {
                HrJobTypeInfo hjtInfo = new HrJobTypeInfo();
                hjtInfo.setId(entity.getJobCodeDetail().getHrJobType().getId());
                if (entity.getJobCodeDetail().getHrJobType().getJobTitle() != null) {
                    HrLuJobTypeInfo hljtInfo = new HrLuJobTypeInfo();
                    hljtInfo.setId(Long.valueOf(entity.getJobCodeDetail().getHrJobType().getJobTitle().getId()));
                    hljtInfo.setJobTitle(entity.getJobCodeDetail().getHrJobType().getJobTitle().getJobTitle());
                    hjtInfo.setJobTitle(hljtInfo);
                }
                if (entity.getJobCodeDetail().getHrJobType().getJobGrade() != null) {
                    HrLuJobGradeInfo hljgInfo = new HrLuJobGradeInfo();
                    hljgInfo.setId(entity.getJobCodeDetail().getHrJobType().getJobGrade().getId());
                    hljgInfo.setJobGrade(entity.getJobCodeDetail().getHrJobType().getJobGrade().getJobGrade());
                    hjtInfo.setJobGrade(hljgInfo);
                }
                jcdInfo.setHrJobType(hjtInfo);
            }
            if (entity.getJobCodeDetail().getIcf() != null) {
                IcfInfo icfInfo = new IcfInfo();
                icfInfo.setId(entity.getJobCodeDetail().getIcf().getId());
                icfInfo.setIcf(entity.getJobCodeDetail().getIcf().getIcf());
                jcdInfo.setIcf(icfInfo);
            }
            dto.setJobCodeDetail(jcdInfo);
        }

        if (entity.getIcf() != null) {
            IcfInfo icfInfo = new IcfInfo();
            icfInfo.setId(entity.getIcf().getId());
            icfInfo.setIcf(entity.getIcf().getIcf());
            dto.setIcf(icfInfo);
        }

        if (entity.getRecruitmentType() != null) {
            RecruitmentTypeInfo rtInfo = new RecruitmentTypeInfo();
            rtInfo.setRecruitmentType(entity.getRecruitmentType().getRecruitmentType());
            rtInfo.setDescription(entity.getRecruitmentType().getDescription());
            dto.setRecruitmentType(rtInfo);
        }

        // --- Deserialize incrementStep and employmentType from selectionRemark ---
        if (entity.getSelectionRemark() != null && !entity.getSelectionRemark().isEmpty()) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                Map<String, String> additionalDetails = objectMapper.readValue(
                        entity.getSelectionRemark(), new TypeReference<Map<String, String>>() {
                        });
                if (additionalDetails.containsKey("incrementStep")) {
                    dto.setIncrementStep(additionalDetails.get("incrementStep"));
                }
                if (additionalDetails.containsKey("employmentType")) {
                    EmploymentTypeInfo etInfo = new EmploymentTypeInfo();
                    etInfo.setType(additionalDetails.get("employmentType"));
                    dto.setEmploymentType(etInfo);
                }
            } catch (Exception e) {
                System.err.println("Error deserializing additional details from selectionRemark: " + e.getMessage());
            }
        }
        return dto;
    }
}