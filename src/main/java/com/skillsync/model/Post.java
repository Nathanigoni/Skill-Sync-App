package com.skillsync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// FIX 9:  Added @NoArgsConstructor and @AllArgsConstructor — MongoDB's deserialization
//         requires a no-args constructor; without it, reading documents from the
//         database throws a MappingInstantiationException at runtime.
// FIX 10: Engagement counters (likes, shares, comments, views) changed from boxed
//         Integer to primitive int. They can never meaningfully be null, and using
//         Integer caused NullPointerExceptions when incrementing (e.g. post.getLikes() + 1)
//         if a document was saved before those fields were initialised.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;

    private String content;
    private List<String> images;
    private String articleTitle;
    private String articleContent;
    private List<String> tags;
    private String codeSnippet;
    private String language;

    // FIX 10: primitive int with @Builder.Default so the builder always starts at 0
    @Builder.Default
    private int likes = 0;
    @Builder.Default
    private int shares = 0;
    @Builder.Default
    private int comments = 0;
    @Builder.Default
    private int views = 0;

    // Track which users have liked this post (for toggle support added in FeedService)
    @Builder.Default
    private List<String> likedBy = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String userAvatar;
    private String userName;
    private String userGithubUsername;

    private PostType postType;

    public enum PostType {
        TEXT, IMAGE, ARTICLE, CODE
    }
}
