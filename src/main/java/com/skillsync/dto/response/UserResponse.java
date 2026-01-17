package com.skillsync.dto.response;

import com.skillsync.model.GitHubStats;
import com.skillsync.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private String id;
    private String email;
    private User.Profile profile;
    private String githubUsername;
    private GitHubStats githubData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}