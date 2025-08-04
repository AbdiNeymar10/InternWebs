package com.example.employee_management.service;

import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.example.employee_management.entity.PasswordResetToken;
import com.example.employee_management.repository.PasswordResetTokenRepository;
import java.util.Optional;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByEmail(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmpId(username);
        }
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        User user = userOpt.get();
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String email, String empId, String rawPassword, String fullName, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.findByEmpId(empId).isPresent()) {
            throw new RuntimeException("EmpId already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setEmpId(empId);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setRole(role);
        return userRepository.save(user);
    }

    // Authenticate by either email or empId
    public User authenticateByIdentifier(String identifier, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmpId(identifier);
        }
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmpId(String empId) {
        return userRepository.findByEmpId(empId).orElse(null);
    }

    public User updateUser(Long id, Map<String, String> body) {
        User user = getUserById(id);
        if (body.containsKey("fullName"))
            user.setFullName(body.get("fullName"));
        if (body.containsKey("email"))
            user.setEmail(body.get("email"));
        if (body.containsKey("empId"))
            user.setEmpId(body.get("empId"));
        if (body.containsKey("role"))
            user.setRole(body.get("role"));
        if (body.containsKey("profilePicture"))
            user.setProfilePicture(body.get("profilePicture"));
        if (body.containsKey("password") && body.get("password") != null && !body.get("password").isEmpty()) {
            user.setPassword(passwordEncoder.encode(body.get("password")));
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Change password logic
    public void changePassword(String identifier, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmpId(identifier);
        }
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    public void createPasswordResetTokenForUser(User user, String token) {
        // Remove any existing token for this user to avoid unique constraint violation
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUser(user);
        if (existingToken != null) {
            passwordResetTokenRepository.delete(existingToken);
        }
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(myToken);
    }

    public void sendPasswordResetEmail(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        User user = userOpt.orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        String token = UUID.randomUUID().toString();
        createPasswordResetTokenForUser(user, token);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public boolean validatePasswordResetToken(String token) {
        PasswordResetToken passToken = passwordResetTokenRepository.findByToken(token);
        if (passToken == null) {
            return false;
        }
        if (passToken.getExpiryDate().before(new java.util.Date())) {
            return false;
        }
        return true;
    }

    public Optional<User> getUserByPasswordResetToken(String token) {
        return Optional.ofNullable(passwordResetTokenRepository.findByToken(token).getUser());
    }

    public void changeUserPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
