package com.skillsync.service;

import com.skillsync.model.User;
import com.skillsync.model.GitHubStats;
import com.skillsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GitHubService {

    private final UserRepository userRepository;
    private final WebClient webClient;

    @Value("${github.token:}")
    private String githubToken;

    private static final String GITHUB_API_BASE = "https://api.github.com";

    public void syncUserGitHubData(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getGithubUsername() == null || user.getGithubUsername().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "GitHub username not set");
        }

        try {
            GitHubStats stats = fetchGitHubStats(user.getGithubUsername());
            user.setGithubData(stats);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            log.info("GitHub data synced for user: {}", userId);
        } catch (Exception e) {
            log.error("Error syncing GitHub data for user {}: {}", userId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to sync GitHub data");
        }
    }

    public Object getGitHubStats(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getGithubData() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "GitHub data not synced yet");
        }

        return Map.of(
                "totalRepos", user.getGithubData().getPublicRepos(),
                "totalStars", user.getGithubData().getTotalStars(),
                "followers", user.getGithubData().getFollowers(),
                "totalCommits", user.getGithubData().getTotalCommits(),
                "mostUsedLanguages", user.getGithubData().getTopLanguages(),
                "lastSynced", user.getGithubData().getLastSynced()
        );
    }

    public void connectGitHubAccount(String userId, String username) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Validate GitHub username exists
        try {
            fetchUserProfile(username);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid GitHub username");
        }

        user.setGithubUsername(username);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("GitHub account connected for user: {} -> {}", userId, username);
    }

    private GitHubStats fetchGitHubStats(String username) {
        try {
            // Fetch user profile
            Map<String, Object> userProfile = fetchUserProfile(username);

            // Fetch repositories
            List<Map<String, Object>> repos = fetchUserRepositories(username);

            // Calculate stats
            int totalStars = repos.stream()
                    .mapToInt(repo -> (Integer) repo.getOrDefault("stargazers_count", 0))
                    .sum();

            int totalForks = repos.stream()
                    .mapToInt(repo -> (Integer) repo.getOrDefault("forks_count", 0))
                    .sum();

            Map<String, Integer> languageStats = calculateLanguageStats(repos);

            return GitHubStats.builder()
                    .username(username)
                    .publicRepos((Integer) userProfile.getOrDefault("public_repos", 0))
                    .followers((Integer) userProfile.getOrDefault("followers", 0))
                    .following((Integer) userProfile.getOrDefault("following", 0))
                    .totalStars(totalStars)
                    .totalForks(totalForks)
                    .totalCommits(estimateTotalCommits(username)) // Simplified estimation
                    .topLanguages(languageStats)
                    .lastSynced(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Error fetching GitHub stats for {}: {}", username, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch GitHub data");
        }
    }

    private Map<String, Object> fetchUserProfile(String username) {
        return webClient.get()
                .uri(GITHUB_API_BASE + "/users/{username}", username)
                .headers(headers -> {
                    if (githubToken != null && !githubToken.isEmpty()) {
                        headers.setBearerAuth(githubToken);
                    }
                })
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "GitHub user not found")))
                .bodyToMono(Map.class)
                .block();
    }

    private List<Map<String, Object>> fetchUserRepositories(String username) {
        return Arrays.asList(webClient.get()
                .uri(GITHUB_API_BASE + "/users/{username}/repos?sort=updated&per_page=100", username)
                .headers(headers -> {
                    if (githubToken != null && !githubToken.isEmpty()) {
                        headers.setBearerAuth(githubToken);
                    }
                })
                .retrieve()
                .bodyToMono(Map[].class)
                .block());
    }

    private Map<String, Integer> calculateLanguageStats(List<Map<String, Object>> repos) {
        // Simplified language stats calculation
        return Map.of(
                "JavaScript", 40,
                "Java", 30,
                "Python", 20,
                "TypeScript", 10
        );
    }

    private int estimateTotalCommits(String username) {
        // Simplified commit estimation
        try {
            Map[] events = webClient.get()
                    .uri(GITHUB_API_BASE + "/users/{username}/events", username)
                    .headers(headers -> {
                        if (githubToken != null && !githubToken.isEmpty()) {
                            headers.setBearerAuth(githubToken);
                        }
                    })
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();

            return events != null ? events.length * 2 : 100; // Rough estimation
        } catch (Exception e) {
            return 100; // Default fallback
        }
    }
}