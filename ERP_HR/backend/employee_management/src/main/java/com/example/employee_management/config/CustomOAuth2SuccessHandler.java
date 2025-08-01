package com.example.employee_management.config;

import com.example.employee_management.config.JwtUtil;
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

        // Find or create user in your DB
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

        // Redirect to frontend with token as query param
        String redirectUrl = "http://localhost:3000/login?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}