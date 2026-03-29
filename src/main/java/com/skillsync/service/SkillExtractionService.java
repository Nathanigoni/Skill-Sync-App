package com.skillsync.service;

import com.skillsync.model.Skill;
import com.skillsync.model.User;
import com.skillsync.repository.SkillRepository;
import com.skillsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkillExtractionService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    private static final Map<String, Skill.SkillCategory> LANGUAGE_CATEGORIES = new HashMap<>();

    static {
        LANGUAGE_CATEGORIES.put("JavaScript", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("TypeScript", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Java", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Python", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("CSS", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("HTML", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("PHP", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Ruby", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Go", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Rust", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("C++", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("C#", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Swift", Skill.SkillCategory.LANGUAGE);
        LANGUAGE_CATEGORIES.put("Kotlin", Skill.SkillCategory.LANGUAGE);
    }

    // Framework detection patterns
    private static final Map<String, String> FRAMEWORK_PATTERNS = new HashMap<>();

    static {
        FRAMEWORK_PATTERNS.put("react", "React");
        FRAMEWORK_PATTERNS.put("vue", "Vue.js");
        FRAMEWORK_PATTERNS.put("angular", "Angular");
        FRAMEWORK_PATTERNS.put("spring-boot", "Spring Boot");
        FRAMEWORK_PATTERNS.put("express", "Express.js");
        FRAMEWORK_PATTERNS.put("django", "Django");
        FRAMEWORK_PATTERNS.put("flask", "Flask");
        FRAMEWORK_PATTERNS.put("laravel", "Laravel");
        FRAMEWORK_PATTERNS.put("rails", "Ruby on Rails");
        FRAMEWORK_PATTERNS.put("next", "Next.js");
        FRAMEWORK_PATTERNS.put("nuxt", "Nuxt.js");
        FRAMEWORK_PATTERNS.put("svelte", "Svelte");
    }

    public void extractSkillsFromGitHub(String userId) {
        log.info("Starting skill extraction for user: {}", userId);

        // TEMPORARY: Create mock skills for testing
        List<Skill> mockSkills = Arrays.asList(
                Skill.builder()
                        .name("Java")
                        .category(Skill.SkillCategory.LANGUAGE)
                        .proficiency(Skill.ProficiencyLevel.ADVANCED)
                        .usageCount(8)
                        .lineCount(25000)
                        .firstUsed(LocalDateTime.now().minusMonths(12))
                        .lastUsed(LocalDateTime.now())
                        .confidence(0.9)
                        .verified(false)
                        .build(),
                Skill.builder()
                        .name("Spring Boot")
                        .category(Skill.SkillCategory.FRAMEWORK)
                        .proficiency(Skill.ProficiencyLevel.INTERMEDIATE)
                        .usageCount(5)
                        .lineCount(12000)
                        .firstUsed(LocalDateTime.now().minusMonths(6))
                        .lastUsed(LocalDateTime.now())
                        .confidence(0.7)
                        .verified(false)
                        .build(),
                Skill.builder()
                        .name("React")
                        .category(Skill.SkillCategory.FRAMEWORK)
                        .proficiency(Skill.ProficiencyLevel.BEGINNER)
                        .usageCount(2)
                        .lineCount(3000)
                        .firstUsed(LocalDateTime.now().minusMonths(3))
                        .lastUsed(LocalDateTime.now())
                        .confidence(0.4)
                        .verified(false)
                        .build()
        );

        // Save mock skills
        skillRepository.deleteByUserId(userId);
        mockSkills.forEach(skill -> {
            skill.setUserId(userId);
            skillRepository.save(skill);
        });

        log.info("Mock skills created for user: {}", userId);
    }

    private List<Map<String, Object>> fetchUserRepositories(String username) {
        String url = "https://api.github.com/users/" + username + "/repos?per_page=100";
        ResponseEntity<Map[]> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), Map[].class);
        return Arrays.asList(response.getBody());
    }

    private Map<String, Integer> fetchRepositoryLanguages(String owner, String repo) {
        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/languages";
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), Map.class);
        return response.getBody();
    }

    private Map<String, Object> fetchPackageJson(String owner, String repo) {
        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/package.json";
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, createHttpEntity(), Map.class);

        // Note: Would need to decode base64 content and parse JSON
        // This is simplified - in production you'd handle the content decoding
        return Collections.emptyMap();
    }

    private void extractLanguages(Map<String, Integer> languages, Map<String, Skill> skills, Map<String, Object> repo) {
        for (Map.Entry<String, Integer> entry : languages.entrySet()) {
            String language = entry.getKey();
            Integer lines = entry.getValue();

            Skill skill = skills.getOrDefault(language, Skill.builder()
                    .name(language)
                    .category(LANGUAGE_CATEGORIES.getOrDefault(language, Skill.SkillCategory.LANGUAGE))
                    .usageCount(0)
                    .lineCount(0)
                    .firstUsed(LocalDateTime.now())
                    .lastUsed(LocalDateTime.now())
                    .build());

            skill.setUsageCount(skill.getUsageCount() + 1);
            skill.setLineCount(skill.getLineCount() + lines);
            skill.setLastUsed(parseRepoDate(repo.get("updated_at")));

            skills.put(language, skill);
        }
    }

    private void extractFrameworksFromPackageJson(Map<String, Object> packageJson, Map<String, Skill> skills, Map<String, Object> repo) {
        // Simplified framework extraction
        // In production, you'd parse dependencies and devDependencies
        FRAMEWORK_PATTERNS.forEach((pattern, frameworkName) -> {
            if (packageJson.toString().toLowerCase().contains(pattern)) {
                Skill skill = skills.getOrDefault(frameworkName, Skill.builder()
                        .name(frameworkName)
                        .category(Skill.SkillCategory.FRAMEWORK)
                        .usageCount(0)
                        .lineCount(0)
                        .firstUsed(LocalDateTime.now())
                        .lastUsed(LocalDateTime.now())
                        .build());

                skill.setUsageCount(skill.getUsageCount() + 1);
                skill.setLastUsed(parseRepoDate(repo.get("updated_at")));

                skills.put(frameworkName, skill);
            }
        });
    }

    private void calculateProficiencyLevels(Map<String, Skill> skills) {
        for (Skill skill : skills.values()) {
            // Simple proficiency calculation based on usage and lines of code
            int score = (skill.getLineCount() / 1000) + (skill.getUsageCount() * 2);

            if (score >= 20) {
                skill.setProficiency(Skill.ProficiencyLevel.EXPERT);
            } else if (score >= 10) {
                skill.setProficiency(Skill.ProficiencyLevel.ADVANCED);
            } else if (score >= 5) {
                skill.setProficiency(Skill.ProficiencyLevel.INTERMEDIATE);
            } else {
                skill.setProficiency(Skill.ProficiencyLevel.BEGINNER);
            }

            // Confidence based on usage count
            double confidence = Math.min(1.0, skill.getUsageCount() / 10.0);
            skill.setConfidence(confidence);
        }
    }

    private LocalDateTime parseRepoDate(Object dateObj) {
        if (dateObj instanceof String) {
            return LocalDateTime.parse(((String) dateObj).replace("Z", ""));
        }
        return LocalDateTime.now();
    }

    private HttpEntity<String> createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "SkillSync-App");
        // Add GitHub token if available for higher rate limits
        return new HttpEntity<>(headers);
    }
}