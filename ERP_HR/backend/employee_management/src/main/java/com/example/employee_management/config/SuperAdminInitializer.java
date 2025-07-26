// package com.example.employee_management.config;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import com.example.employee_management.entity.User;
// import com.example.employee_management.repository.UserRepository;

// @Configuration
// public class SuperAdminInitializer {

// @Bean
// public CommandLineRunner createSuperAdmin(UserRepository userRepository,
// PasswordEncoder passwordEncoder) {
// return args -> {
// if (userRepository.findByEmail("superadmin@example.com").isEmpty()) {
// User superAdmin = new User();
// superAdmin.setEmail("superadmin@example.com");
// superAdmin.setEmpId("4");
// superAdmin.setPassword(passwordEncoder.encode("555555"));
// superAdmin.setRole("SUPER_ADMIN");
// userRepository.save(superAdmin);
// }
// };
// }
// }
