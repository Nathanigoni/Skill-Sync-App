package com.skillsync.controller;

import com.skillsync.dto.request.ConnectGitHubRequest;
import com.skillsync.dto.response.ApiResponse;
import com.skillsync.security.UserPrincipal;
import com.skillsync.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GitHubService gitHubService;

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<Void>> syncGitHubData(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        gitHubService.syncUserGitHubData(userId);
        return ResponseEntity.ok(ApiResponse.success("GitHub data synced successfully", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getGitHubStats(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        Object stats = gitHubService.getGitHubStats(userId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<Void>> connectGitHub(
            @RequestBody ConnectGitHubRequest request,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        gitHubService.connectGitHubAccount(userId, request.getUsername());
        return ResponseEntity.ok(ApiResponse.success("GitHub account connected", null));
    }
}