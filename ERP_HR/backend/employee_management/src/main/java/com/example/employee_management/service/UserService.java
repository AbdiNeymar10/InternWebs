package com.example.employee_management.service;

import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Map;

@Service
public class UserService implements UserDetailsService {
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
        if (body.containsKey("password") && body.get("password") != null && !body.get("password").isEmpty()) {
            user.setPassword(passwordEncoder.encode(body.get("password")));
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
