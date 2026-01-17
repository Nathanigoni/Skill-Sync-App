package com.skillsync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;

    // Post content
    private String content;
    private List<String> images; // URLs to uploaded images
    private String articleTitle; // For LinkedIn-style articles
    private String articleContent; // Long-form content
    private List<String> tags;
    private String codeSnippet;
    private String language;

    // Engagement metrics
    private Integer likes;
    private Integer shares;
    private Integer comments;
    private Integer views;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Embedded user info
    private String userAvatar;
    private String userName;
    private String userGithubUsername;

    // Post type
    private PostType postType;

    public enum PostType {
        TEXT, IMAGE, ARTICLE, CODE
    }
}