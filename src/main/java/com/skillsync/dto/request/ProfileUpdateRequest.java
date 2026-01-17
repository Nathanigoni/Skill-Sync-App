package com.skillsync.dto.request;

import com.skillsync.model.User;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private User.Profile profile;
    private String githubUsername;
}