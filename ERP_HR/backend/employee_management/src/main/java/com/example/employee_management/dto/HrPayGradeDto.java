package com.example.employee_management.dto;

import lombok.Getter;
import lombok.Setter;
import java.nio.charset.StandardCharsets;

// Import necessary classes for decryption
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
// import javax.crypto.spec.IvParameterSpec; // Not needed for ECB mode

@Getter
@Setter
public class HrPayGradeDto {
    private Long payGradeId;
    private String salary; // This will hold the encrypted salary from the entity
    private String stepNo;
    private Long rankId;

    /**
     * Decrypts the salary string.
     * Assumes AES/ECB/PKCS5Padding based on observed data patterns.
     *
     * @return The decrypted salary string, or an error message if decryption fails.
     */
    public String getDecryptedSalary() {
        if (this.salary == null || this.salary.isEmpty()) {
            return null;
        }

        try {
            // Step 1: Convert the hexadecimal string to a byte array
            byte[] encryptedBytes = hexStringToByteArray(this.salary);

            // --- Step 2: Implement your actual decryption logic here ---
            // Based on data analysis: AES/ECB/PKCS5Padding
            String encryptionAlgorithm = "AES";
            String cipherTransformation = "AES/ECB/PKCS5Padding"; // Identified from data patterns

            // DANGER: Replace "YourSecretKey1234567890123456" with your ACTUAL secret key.
            // This key MUST be securely loaded (e.g., from environment variables, a vault),
            // NOT hardcoded in production.
            // The example key below is 16 bytes (128 bits) for AES-128.
            // If your key is 24 or 32 bytes, adjust accordingly.
            String secretKeyString = "YourSecretKey1234567890123456"; // <--- REPLACE THIS!
            byte[] keyBytes = secretKeyString.getBytes(StandardCharsets.UTF_8);

            // Ensure key length matches AES requirements (16, 24, or 32 bytes)
            if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32) {
                throw new IllegalArgumentException("Invalid AES key length. Must be 16, 24, or 32 bytes.");
            }

            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, encryptionAlgorithm);

            Cipher cipher = Cipher.getInstance(cipherTransformation);
            cipher.init(Cipher.DECRYPT_MODE, secretKey); // ECB mode does not use an IV

            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

            // Step 3: Convert decrypted bytes to String using the correct character encoding
            return new String(decryptedBytes, StandardCharsets.UTF_8);

        } catch (IllegalArgumentException e) {
            System.err.println("Error converting hex string to byte array or invalid key length: " + e.getMessage());
            return "Decryption Error (Invalid Hex/Key)";
        } catch (Exception e) {
            System.err.println("An unexpected error occurred during salary decryption: " + e.getMessage());
            e.printStackTrace(); // Print stack trace for detailed debugging
            return "Decryption Error";
        }
    }

    /**
     * Converts a hexadecimal string to a byte array.
     * Example: "5B51F84A" -> byte array {0x5B, 0x51, 0xF8, 0x4A}
     * @param hexString The hexadecimal string.
     * @return The byte array.
     * @throws IllegalArgumentException if the string is not a valid hex string or has odd length.
     */
    private byte[] hexStringToByteArray(String hexString) {
        int len = hexString.length();
        if (len % 2 != 0) {
            throw new IllegalArgumentException("Hex string must have an even number of characters.");
        }
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4)
                    + Character.digit(hexString.charAt(i+1), 16));
        }
        return data;
    }
}