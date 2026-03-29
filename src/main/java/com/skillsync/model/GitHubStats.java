package com.skillsync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitHubStats {
    private String username;
    private Integer publicRepos;
    private Integer followers;
    private Integer following;
    private Integer totalStars;
    private Integer totalForks;
    private Integer totalCommits;
    private Map<String, Integer> topLanguages;
    private LocalDateTime lastSynced;
}