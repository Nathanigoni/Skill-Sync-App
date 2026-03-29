package com.skillsync.controller;

import com.skillsync.dto.response.AnalyticsResponse;
import com.skillsync.dto.response.ApiResponse;
import com.skillsync.security.UserPrincipal;
import com.skillsync.service.AnalyticsService;
import com.skillsync.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private ProjectService projectService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getStats(
            @RequestParam(defaultValue = "30") int days,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();
        AnalyticsResponse stats = analyticsService.getUserAnalytics(userId, days);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getUserStats(
            @PathVariable String userId,
            @RequestParam(defaultValue = "30") int days) {
        AnalyticsResponse stats = analyticsService.getUserAnalytics(userId, days);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PostMapping("/event")
    public ResponseEntity<ApiResponse<Void>> trackEvent(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request,
            Authentication authentication) {

        String eventType = payload.get("eventType");
        String projectId = payload.get("projectId");
        String ipAddress = getClientIP(request);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        if ("PROFILE_VIEW".equals(eventType) && userId != null) {
            analyticsService.trackProfileView(userId, ipAddress);
        } else if ("PROJECT_VIEW".equals(eventType) && userId != null && projectId != null) {
            analyticsService.trackProjectView(userId, projectId, ipAddress);
            projectService.incrementProjectView(projectId);
        } else if ("PROJECT_CLICK".equals(eventType) && userId != null && projectId != null) {
            String clickType = payload.getOrDefault("clickType", "general");
            analyticsService.trackProjectClick(userId, projectId, clickType);
            projectService.incrementProjectClick(projectId);
        }

        return ResponseEntity.ok(ApiResponse.success("Event tracked", null));
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}