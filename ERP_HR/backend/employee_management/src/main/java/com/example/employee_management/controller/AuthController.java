package com.example.employee_management.controller;

import com.example.employee_management.entity.User;
import com.example.employee_management.service.UserService;
import com.example.employee_management.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    // In-memory store for reset tokens
    private final Map<String, String> resetTokens = new java.util.concurrent.ConcurrentHashMap<>();

    // Forgot password: send reset token to email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String emailOrEmpId = body.get("identifier");
        if (emailOrEmpId == null || emailOrEmpId.isEmpty()) {
            return ResponseEntity.badRequest().body("Identifier (email or empId) is required");
        }
        User user = null;
        if (emailOrEmpId.contains("@")) {
            user = userService.getUserByEmail(emailOrEmpId);
        } else {
            user = userService.getUserByEmpId(emailOrEmpId);
        }
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        // Generate a simple token (for demo; use secure random in production)
        String token = java.util.UUID.randomUUID().toString();
        resetTokens.put(token, user.getEmail());
        // In production, send email with link:
        // http://localhost:3000/reset-password?token=...
        return ResponseEntity.ok(Map.of("resetToken", token, "message",
                "Password reset token generated. Use this token to reset your password."));
    }

    // Reset password using token
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }
        String email = resetTokens.get(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        userService.updateUser(user.getId(), Map.of("password", newPassword));
        resetTokens.remove(token);
        return ResponseEntity.ok("Password reset successful");
    }

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null || role.isEmpty()) {
                role = "EMPLOYEE";
            }
            String fullName = body.get("fullName");
            if (fullName == null || fullName.isEmpty()) {
                return ResponseEntity.badRequest().body("Full name is required");
            }
            User user = userService.register(
                    body.get("email"),
                    body.get("empId"),
                    body.get("password"),
                    fullName,
                    role);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            User user = userService.authenticateByIdentifier(
                    body.get("identifier"),
                    body.get("password"));
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", user.getEmail(),
                    "empId", user.getEmpId(),
                    "role", user.getRole(),
                    "fullName", user.getFullName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null || role.isEmpty()) {
                return ResponseEntity.badRequest().body("Role is required");
            }
            String fullName = body.get("fullName");
            if (fullName == null || fullName.isEmpty()) {
                return ResponseEntity.badRequest().body("Full name is required");
            }
            String email = body.get("email");
            String empId = body.get("empId");
            String password = body.get("password");
            if (email == null || email.isEmpty() || empId == null || empId.isEmpty() || password == null
                    || password.isEmpty()) {
                return ResponseEntity.badRequest().body("Email, EmpId, and Password are required");
            }
            User user = userService.register(email, empId, password, fullName, role);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user by id
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update user
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            User updated = userService.updateUser(id, body);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user by empId
    @GetMapping("/users/empid/{empId}")
    public ResponseEntity<?> getUserByEmpId(@PathVariable String empId) {
        try {
            User user = userService.getUserByEmpId(empId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Upload user profile picture by empId
    @PostMapping("/users/empid/{empId}/profile-picture")
    public ResponseEntity<?> uploadProfilePictureByEmpId(@PathVariable String empId,
            @RequestParam("file") MultipartFile file) {
        try {
            User user = userService.getUserByEmpId(empId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String baseDir = System.getProperty("user.dir"); // Project root
            String uploadDir = baseDir + File.separator + "uploads" + File.separator + "profile-pictures"
                    + File.separator;
            File dir = new File(uploadDir);
            if (!dir.exists())
                dir.mkdirs();
            String savedFileName = user.getId() + "_" + fileName;
            String filePath = uploadDir + savedFileName;
            File destFile = new File(filePath);
            System.out.println("Saving file to: " + destFile.getAbsolutePath());
            file.transferTo(destFile);
            user.setProfilePicture(savedFileName);
            userService.updateUser(user.getId(), Map.of("profilePicture", savedFileName));
            return ResponseEntity.ok(Map.of("profilePicture", savedFileName));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload: " + e.getMessage());
        }
    }

    // Get user profile picture by empId
    @GetMapping("/users/empid/{empId}/profile-picture")
    public ResponseEntity<?> getProfilePictureByEmpId(@PathVariable String empId) {
        try {
            User user = userService.getUserByEmpId(empId);
            if (user == null || user.getProfilePicture() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
            }
            String baseDir = System.getProperty("user.dir");
            String uploadDir = baseDir + File.separator + "uploads" + File.separator + "profile-pictures"
                    + File.separator;
            String filePath = uploadDir + user.getProfilePicture();
            File imgFile = new File(filePath);
            if (!imgFile.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }
            String contentType = "image/jpeg";
            String lowerName = imgFile.getName().toLowerCase();
            if (lowerName.endsWith(".png"))
                contentType = "image/png";
            else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg"))
                contentType = "image/jpeg";
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add("Content-Type", contentType);
            return ResponseEntity.ok().headers(headers).body(java.nio.file.Files.readAllBytes(imgFile.toPath()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving image: " + e.getMessage());
        }
    }

    // Change password endpoint
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        try {
            String identifier = body.get("identifier"); // email or empId
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");
            if (identifier == null || currentPassword == null || newPassword == null
                    || identifier.isEmpty() || currentPassword.isEmpty() || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body("All fields are required");
            }
            userService.changePassword(identifier, currentPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Redirect endpoint for Google OAuth2 login
    @GetMapping("/google")
    public void redirectToGoogle(HttpServletResponse response) throws java.io.IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

}
