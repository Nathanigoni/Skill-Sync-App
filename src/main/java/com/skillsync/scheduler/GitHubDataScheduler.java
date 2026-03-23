package com.skillsync.scheduler;

import com.skillsync.service.GitHubService;
import com.skillsync.service.SkillExtractionService;
import com.skillsync.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GitHubDataScheduler {

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private SkillExtractionService skillExtractionService;

    @Autowired
    private UserRepository userRepository;

    @Scheduled(fixedRate = 6 * 60 * 60 * 1000) // Every 6 hours
    public void updateAllUsersGitHubData() {
        log.info("Starting scheduled GitHub data update...");

        // FIX 7: Was findAll() with a manual null-check inside the loop.
        // Now uses findByGithubUsernameIsNotNull() — the repository query
        // already filters at the database level, so only relevant users are
        // loaded into memory. Consistent with extractSkillsForActiveUsers below.
        userRepository.findByGithubUsernameIsNotNull().forEach(user -> {
            // Extra isEmpty guard kept for safety (empty-string usernames)
            if (!user.getGithubUsername().isEmpty()) {
                try {
                    gitHubService.syncUserGitHubData(user.getId());
                    log.info("Successfully updated GitHub data for user: {}", user.getGithubUsername());
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("GitHub data update was interrupted");
                } catch (Exception e) {
                    log.error("Failed to update GitHub data for user {}: {}", user.getGithubUsername(), e.getMessage());
                }
            }
        });

        log.info("Completed scheduled GitHub data update");
    }

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Every 24 hours
    public void extractSkillsForActiveUsers() {
        log.info("Starting scheduled skill extraction...");

        userRepository.findByGithubUsernameIsNotNull().forEach(user -> {
            if (!user.getGithubUsername().isEmpty()) {
                try {
                    skillExtractionService.extractSkillsFromGitHub(user.getId());
                    log.info("Skills extracted for user: {}", user.getGithubUsername());
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("Skill extraction was interrupted");
                } catch (Exception e) {
                    log.error("Failed to extract skills for user {}: {}", user.getGithubUsername(), e.getMessage());
                }
            }
        });

        log.info("Completed scheduled skill extraction");
    }
}
