package com.skillsync.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private List<String> techStack;
    private String repoUrl;
    private String liveUrl;
    private String imageUrl;
    private boolean featured;
    private int viewCount;
    private int clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}