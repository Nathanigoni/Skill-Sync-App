package com.skillsync.service;

import com.skillsync.dto.request.ProfileUpdateRequest;
import com.skillsync.dto.response.UserResponse;
import com.skillsync.model.User;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // FIX 5: Methods now accept an explicit userId passed in from the controller.
    // SecurityContextHolder is no longer used here — the controller owns identity
    // extraction, the service owns business logic. This also makes unit testing
    // straightforward since no security context setup is needed.
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse updateProfile(String userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
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
