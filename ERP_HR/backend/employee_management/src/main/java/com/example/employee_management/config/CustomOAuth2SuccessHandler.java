package com.example.employee_management.config;

// import com.example.employee_management.config.JwtUtil;
import com.example.employee_management.entity.User;
import com.example.employee_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Find or create user in  DB
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user = userOpt.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(oAuth2User.getAttribute("name"));
            newUser.setRole("EMPLOYEE");
            return userRepository.save(newUser);
        });

        // Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        // Prepare user info for redirect
        String empId = user.getEmpId() != null ? user.getEmpId() : "";
        String role = user.getRole() != null ? user.getRole() : "EMPLOYEE";
        String fullName = user.getFullName() != null ? user.getFullName() : "";

        // URL encode parameters to avoid issues with special characters
        String redirectUrl = String.format(
                "http://localhost:3000/login?token=%s&email=%s&empId=%s&role=%s&fullName=%s",
                java.net.URLEncoder.encode(token, "UTF-8"),
                java.net.URLEncoder.encode(email, "UTF-8"),
                java.net.URLEncoder.encode(empId, "UTF-8"),
                java.net.URLEncoder.encode(role, "UTF-8"),
                java.net.URLEncoder.encode(fullName, "UTF-8"));
        response.sendRedirect(redirectUrl);
    }
}