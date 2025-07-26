package com.example.employee_management.controller;

import com.example.employee_management.entity.User;
import com.example.employee_management.service.UserService;
import com.example.employee_management.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

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
}
