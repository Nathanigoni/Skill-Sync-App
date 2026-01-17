package com.skillsync.service;

import com.skillsync.dto.request.ProjectRequest;
import com.skillsync.model.Project;
import com.skillsync.model.User;
import com.skillsync.repository.ProjectRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Project> getProjectsByUserId(String userId) {
        return projectRepository.findByUserId(userId);
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project createProject(ProjectRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .techStack(request.getTechStack())
                .repoUrl(request.getRepoUrl())
                .liveUrl(request.getLiveUrl())
                .imageUrl(request.getImageUrl())
                .featured(request.isFeatured())
                .viewCount(0)
                .clickCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return projectRepository.save(project);
    }

    public Project updateProject(String id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setTechStack(request.getTechStack());
        project.setRepoUrl(request.getRepoUrl());
        project.setLiveUrl(request.getLiveUrl());
        project.setImageUrl(request.getImageUrl());
        project.setFeatured(request.isFeatured());
        project.setUpdatedAt(LocalDateTime.now());

        return projectRepository.save(project);
    }

    public void deleteProject(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    public void incrementProjectView(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setViewCount(project.getViewCount() + 1);
        projectRepository.save(project);
    }

    public void incrementProjectClick(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setClickCount(project.getClickCount() + 1);
        projectRepository.save(project);
    }
}