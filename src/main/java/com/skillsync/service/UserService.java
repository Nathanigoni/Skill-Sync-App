package com.skillsync.service;

import com.skillsync.dto.request.ProfileUpdateRequest;
import com.skillsync.dto.response.UserResponse;
import com.skillsync.model.User;
import com.skillsync.repository.UserRepository;
import com.skillsync.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse getCurrentUser() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    public UserResponse updateProfile(ProfileUpdateRequest request) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getProfile() != null) {
            user.setProfile(request.getProfile());
        }
        if (request.getGithubUsername() != null) {
            user.setGithubUsername(request.getGithubUsername());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .profile(user.getProfile())
                .githubUsername(user.getGithubUsername())
                .githubData(user.getGithubData())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}