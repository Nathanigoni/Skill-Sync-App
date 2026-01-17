package com.skillsync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String email;
    private String passwordHash;

    @Builder.Default
    private Profile profile = new Profile();

    private String githubUsername;

    private GitHubStats githubData;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Profile {
        @Builder.Default
        private String name = "";

        @Builder.Default
        private String bio = "";

        @Builder.Default
        private String avatar = "";

        @Builder.Default
        private Map<String, String> links = new HashMap<>();
    }
}