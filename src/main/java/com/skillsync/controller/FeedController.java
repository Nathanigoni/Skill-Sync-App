package com.skillsync.controller;

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

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @PostMapping("/post/text")
    public ResponseEntity<Post> createTextPost(@RequestBody CreatePostRequest request, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        Post post = feedService.createTextPost(userId, request.getContent(), request.getTags());
        return ResponseEntity.ok(post);
    }

    @PostMapping("/post/image")
    public ResponseEntity<Post> createImagePost(
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "tags", required = false) List<String> tags,
            Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        Post post = feedService.createImagePost(userId, content, images, tags);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/post/article")
    public ResponseEntity<Post> createArticlePost(@RequestBody CreatePostRequest request, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        Post post = feedService.createArticlePost(userId, request.getArticleTitle(), request.getArticleContent(), request.getTags());
        return ResponseEntity.ok(post);
    }

    @PostMapping("/post/code")
    public ResponseEntity<Post> createCodePost(@RequestBody CreatePostRequest request, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String userId = principal.getId();

        Post post = feedService.createCodePost(userId, request.getContent(), request.getCodeSnippet(), request.getLanguage(), request.getTags());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/global")
    public ResponseEntity<List<Post>> getGlobalFeed() {
        List<Post> posts = feedService.getGlobalFeed();
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> likePost(@PathVariable String postId) {
        Post post = feedService.likePost(postId);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{postId}/view")
    public ResponseEntity<Post> viewPost(@PathVariable String postId) {
        Post post = feedService.viewPost(postId);
        return ResponseEntity.ok(post);
    }
}