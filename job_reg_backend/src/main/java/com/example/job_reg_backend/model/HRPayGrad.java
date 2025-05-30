package com.example.job_reg_backend.model;

import jakarta.persistence.*;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Entity
@Table(name = "HR_PAY_GRAD")
public class HRPayGrad {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pay_grad_seq")
    @SequenceGenerator(name = "pay_grad_seq", sequenceName = "HR_PAY_GRAD_SEQ", allocationSize = 1)
    @Column(name = "PAY_GRADE_ID")
    private Long payGradeId;

    @Convert(converter = SalaryEncryptor.class) // Apply encryption to the salary field
    @Column(name = "SALARY", length = 500)
    private String salary;

    @Column(name = "STEP_NO", length = 20)
    private String stepNo;

    @ManyToOne
    @JoinColumn(name = "RANK_ID", referencedColumnName = "RANK_ID")
    private HRRank rank; // Foreign key to HR_RANK table

    // Constructors
    public HRPayGrad() {}

    public HRPayGrad(Long payGradeId, String salary, String stepNo, HRRank rank) {
        this.payGradeId = payGradeId;
        this.salary = salary;
        this.stepNo = stepNo;
        this.rank = rank;
    }

    // Getters and Setters
    public Long getPayGradeId() {
        return payGradeId;
    }

    public void setPayGradeId(Long payGradeId) {
        this.payGradeId = payGradeId;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getStepNo() {
        return stepNo;
    }

    public void setStepNo(String stepNo) {
        this.stepNo = stepNo;
    }

    public HRRank getRank() {
        return rank;
    }

    public void setRank(HRRank rank) {
        this.rank = rank;
    }

    // Inner class for Salary Encryption
    @Converter
public static class SalaryEncryptor implements AttributeConverter<String, String> {

    private static final String SECRET_KEY = "1234567890123456"; // Must match the encryption.key in application.properties

   @Override
public String convertToDatabaseColumn(String attribute) {
    try {
        if (attribute == null || attribute.isEmpty()) {
            return null; // Return null if the attribute is null or empty
        }

        Cipher cipher = Cipher.getInstance("AES");
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        String encryptedValue = Base64.getEncoder().encodeToString(cipher.doFinal(attribute.getBytes()));
        System.out.println("Encrypting salary: " + attribute + " -> " + encryptedValue); // Log encryption
        return encryptedValue;
    } catch (Exception e) {
        e.printStackTrace(); // Log the exception
        throw new RuntimeException("Error encrypting salary", e);
    }
}

@Override
public String convertToEntityAttribute(String dbData) {
    try {
        if (dbData == null || dbData.isEmpty()) {
            return null; // Return null if the database value is null or empty
        }
        Cipher cipherLocal = Cipher.getInstance("AES");
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
        cipherLocal.init(Cipher.DECRYPT_MODE, keySpec);
        String decryptedValue = new String(cipherLocal.doFinal(Base64.getDecoder().decode(dbData)));
        System.out.println("Decrypting salary: " + dbData + " -> " + decryptedValue); // Log decryption
        return decryptedValue;
    } catch (Exception e) {
        System.err.println("Error decrypting salary: " + dbData); // Log the problematic data
        e.printStackTrace();
        return null; // Return null instead of a blank or throwing
    }
}
}
}