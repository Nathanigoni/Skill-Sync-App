package com.skillsync.controller;

import com.skillsync.dto.request.ProjectRequest;
import com.skillsync.dto.response.ApiResponse;
import com.skillsync.model.Project;
import com.skillsync.security.UserPrincipal;
import com.skillsync.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getCurrentUserProjects(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();
        List<Project> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsByUserId(@PathVariable String userId) {
        List<Project> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable String id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();
        Project project = projectService.createProject(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @PathVariable String id,
            @Valid @RequestBody ProjectRequest request) {
        Project project = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }
}