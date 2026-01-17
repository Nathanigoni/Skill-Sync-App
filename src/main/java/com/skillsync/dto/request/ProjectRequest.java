package com.skillsync.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ProjectRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private List<String> techStack;
    private String repoUrl;
    private String liveUrl;
    private String imageUrl;
    private boolean featured;
}