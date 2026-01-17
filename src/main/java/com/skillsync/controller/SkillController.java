package com.skillsync.controller;

import com.skillsync.dto.response.ApiResponse;
import com.skillsync.model.Skill;
import com.skillsync.security.UserPrincipal;
import com.skillsync.service.SkillExtractionService;
import com.skillsync.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillExtractionService skillExtractionService;
    private final SkillService skillService;

    @PostMapping("/extract")
    public ResponseEntity<ApiResponse<String>> extractSkills(Authentication authentication) {
        try {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String userId = principal.getId();

            skillExtractionService.extractSkillsFromGitHub(userId);
            return ResponseEntity.ok(ApiResponse.success("Skills extraction started successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to extract skills: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<Skill>>> getMySkills(Authentication authentication) {
        try {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String userId = principal.getId();

            List<Skill> skills = skillService.getUserSkills(userId);
            return ResponseEntity.ok(ApiResponse.success(skills));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get skills: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Skill>>> getUserSkills(@PathVariable String userId) {
        try {
            List<Skill> skills = skillService.getUserVerifiedSkills(userId);
            return ResponseEntity.ok(ApiResponse.success(skills));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user skills: " + e.getMessage()));
        }
    }

    @PutMapping("/{skillId}/verify")
    public ResponseEntity<ApiResponse<Skill>> verifySkill(
            @PathVariable String skillId,
            @RequestParam boolean verified,
            Authentication authentication) {
        try {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String userId = principal.getId();

            Skill skill = skillService.verifySkill(skillId, userId, verified);
            return ResponseEntity.ok(ApiResponse.success("Skill verification updated", skill));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to verify skill: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @PathVariable String skillId,
            Authentication authentication) {
        try {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String userId = principal.getId();

            skillService.deleteSkill(skillId, userId);
            return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete skill: " + e.getMessage()));
        }
    }
}