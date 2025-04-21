package com.example.job_reg_backend.model;

import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Value;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Entity
@Table(name = "HR_RANK")
public class HRRank {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "hr_rank_seq")
    @SequenceGenerator(name = "hr_rank_seq", sequenceName = "HR_RANK_SEQ", allocationSize = 1)
    @Column(name = "RANK_ID")
    private Long rankId;

    @Convert(converter = SalaryEncryptor.class)
    @Column(name = "BEGINNING_SALARY")
    private String beginningSalary;

    @Convert(converter = SalaryEncryptor.class)
    @Column(name = "MAX_SALARY")
    private String maxSalary;

    @ManyToOne
    @JoinColumn(name = "JOB_GRADE_ID", referencedColumnName = "ID")
    private HRLuJobGrade jobGrade; // Foreign key to HR_LU_JOB_GRADE

    @ManyToOne
    @JoinColumn(name = "ICF_ID", referencedColumnName = "ID")
    private HRLuIcf icf; // Foreign key to HR_LU_ICF

    // Constructors
    public HRRank() {}

    public HRRank(Long rankId, String beginningSalary, String maxSalary, HRLuJobGrade jobGrade, HRLuIcf icf) {
        this.rankId = rankId;
        this.beginningSalary = beginningSalary;
        this.maxSalary = maxSalary;
        this.jobGrade = jobGrade;
        this.icf = icf;
    }

    // Getters and Setters
    public Long getRankId() {
        return rankId;
    }

    public void setRankId(Long rankId) {
        this.rankId = rankId;
    }

    public String getBeginning() {
        return beginningSalary;
    }

    public void setBeginning(String beginningSalary) {
        this.beginningSalary = beginningSalary;
    }

    public String getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(String maxSalary) {
        this.maxSalary = maxSalary;
    }

    public HRLuJobGrade getJobGrade() {
        return jobGrade;
    }

    public void setJobGrade(HRLuJobGrade jobGrade) {
        this.jobGrade = jobGrade;
    }

    public HRLuIcf getIcf() {
        return icf;
    }

    public void setIcf(HRLuIcf icf) {
        this.icf = icf;
    }
}

// Encryptor for BEGINNING and MAX_SALARY
@Converter
class SalaryEncryptor implements AttributeConverter<String, String> {

    @Value("${encryption.key}")
    private String secretKey;

    @Override
    public String convertToDatabaseColumn(String attribute) {
        try {
            if (secretKey == null || secretKey.length() != 16) {
                throw new IllegalArgumentException("Invalid encryption key. It must be 16 characters long.");
            }

            Cipher cipher = Cipher.getInstance("AES");
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            return Base64.getEncoder().encodeToString(cipher.doFinal(attribute.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting salary", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        try {
            if (secretKey == null || secretKey.length() != 16) {
                throw new IllegalArgumentException("Invalid encryption key. It must be 16 characters long.");
            }

            Cipher cipher = Cipher.getInstance("AES");
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            return new String(cipher.doFinal(Base64.getDecoder().decode(dbData)));
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting salary", e);
        }
    }
}
