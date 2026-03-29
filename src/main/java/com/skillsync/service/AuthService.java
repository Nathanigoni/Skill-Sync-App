package com.skillsync.service;

import com.skillsync.dto.request.AuthRequest;
import com.skillsync.dto.request.RegisterRequest;
import com.skillsync.dto.response.AuthResponse;
import com.skillsync.model.User;
import com.skillsync.repository.UserRepository;
import com.skillsync.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        // Authenticate first
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get the user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate token with user ID as principal (consistent with registration)
        String token = jwtTokenProvider.generateToken(
                new UsernamePasswordAuthenticationToken(
                        user.getId(), // Use user ID as principal
                        null,
                        authentication.getAuthorities()
                )
        );

        log.info("Login successful for user: {}", user.getEmail());
        return buildAuthResponse(token, user);
    }

    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());

        // Check if user exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        // Build profile from the name field
        User.Profile profile = User.Profile.builder()
                .name(request.getName())
                .build();

        // Create and save user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .profile(profile)  // Use the built profile
                .githubUsername(request.getGithubUsername())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User saved with ID: {}", savedUser.getId());

        // Generate token
        String token = jwtTokenProvider.generateToken(
                new UsernamePasswordAuthenticationToken(
                        savedUser.getId(),
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                )
        );

        log.info("Registration successful for user: {}", savedUser.getEmail());
        return buildAuthResponse(token, savedUser);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }
}