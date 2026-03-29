package com.skillsync.controller;

import com.skillsync.dto.response.ApiResponse;
import com.skillsync.dto.request.CreatePostRequest;
import com.skillsync.model.Post;
import com.skillsync.security.UserPrincipal;
import com.skillsync.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// FIX 6: likePost and viewPost now receive the authenticated user's ID so the
//         service can track who performed the action (toggle likes, deduplicate views).
// FIX 11: All endpoints now return ResponseEntity<ApiResponse<T>> so the frontend
//         always receives the consistent { success, message, data, timestamp } envelope
//         it expects — matching every other controller in the project.
@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @PostMapping("/post/text")
    public ResponseEntity<ApiResponse<Post>> createTextPost(
            @RequestBody CreatePostRequest request,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Post post = feedService.createTextPost(principal.getId(), request.getContent(), request.getTags());
        return ResponseEntity.ok(ApiResponse.success("Post created successfully", post));
    }

    @PostMapping("/post/image")
    public ResponseEntity<ApiResponse<Post>> createImagePost(
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "tags", required = false) List<String> tags,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Post post = feedService.createImagePost(principal.getId(), content, images, tags);
        return ResponseEntity.ok(ApiResponse.success("Image post created successfully", post));
    }

    @PostMapping("/post/article")
    public ResponseEntity<ApiResponse<Post>> createArticlePost(
            @RequestBody CreatePostRequest request,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Post post = feedService.createArticlePost(
                principal.getId(),
                request.getArticleTitle(),
                request.getArticleContent(),
                request.getTags()
        );
        return ResponseEntity.ok(ApiResponse.success("Article created successfully", post));
    }

    @PostMapping("/post/code")
    public ResponseEntity<ApiResponse<Post>> createCodePost(
            @RequestBody CreatePostRequest request,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Post post = feedService.createCodePost(
                principal.getId(),
                request.getContent(),
                request.getCodeSnippet(),
                request.getLanguage(),
                request.getTags()
        );
        return ResponseEntity.ok(ApiResponse.success("Code post created successfully", post));
    }

    @GetMapping("/global")
    public ResponseEntity<ApiResponse<List<Post>>> getGlobalFeed() {
        List<Post> posts = feedService.getGlobalFeed();
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    // FIX 6: userId passed to service so likes can be toggled per-user
    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<Post>> likePost(
            @PathVariable String postId,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Post post = feedService.likePost(postId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(post));
    }

    // FIX 6: userId passed to service so duplicate views from same user can be handled
    @PostMapping("/{postId}/view")
    public ResponseEntity<ApiResponse<Post>> viewPost(
            @PathVariable String postId,
            Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Post post = feedService.viewPost(postId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(post));
    }
}
