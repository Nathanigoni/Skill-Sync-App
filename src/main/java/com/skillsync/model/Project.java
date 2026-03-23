package com.skillsync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

// FIX 9: Added @NoArgsConstructor and @AllArgsConstructor.
// MongoDB requires a no-args constructor to deserialise documents back into
// Java objects. Without it, any read from the projects collection throws a
// MappingInstantiationException. @AllArgsConstructor is added alongside it
// so @Builder continues to work correctly (Lombok's @Builder needs either
// @AllArgsConstructor or will generate one implicitly — being explicit avoids
// surprises when other annotations are added later).
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
