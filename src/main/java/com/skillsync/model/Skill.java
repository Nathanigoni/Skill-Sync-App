package com.skillsync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "skills")
public class Skill {
    @Id
    private String id;
    private String userId;
    private String name;
    private SkillCategory category;
    private ProficiencyLevel proficiency;
    private Integer usageCount;
    private Integer lineCount;
    private LocalDateTime firstUsed;
    private LocalDateTime lastUsed;
    private Double confidence; // 0.0 to 1.0
    private Boolean verified; // User verified this skill

    public enum SkillCategory {
        LANGUAGE, FRAMEWORK, TOOL, DATABASE, PLATFORM, LIBRARY
    }

    public enum ProficiencyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    }
}