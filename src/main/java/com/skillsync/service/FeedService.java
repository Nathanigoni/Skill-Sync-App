package com.skillsync.service;

import com.skillsync.model.Post;
import com.skillsync.model.User;
import com.skillsync.repository.PostRepository;
import com.skillsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public Post createTextPost(String userId, String content, List<String> tags) {
        User user = getUser(userId);
        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .tags(tags)
                .postType(Post.PostType.TEXT)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .likedBy(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();
        return enrichPostWithImageUrls(postRepository.save(post));
    }

    public Post createImagePost(String userId, String content, List<MultipartFile> images, List<String> tags) {
        try {
            User user = getUser(userId);
            List<String> imageUrls = new ArrayList<>();
            if (images != null && !images.isEmpty()) {
                for (MultipartFile image : images) {
                    String contentType = image.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        throw new RuntimeException("Only image files are allowed");
                    }
                    imageUrls.add(fileStorageService.storeFile(image));
                }
            }
            Post post = Post.builder()
                    .userId(userId)
                    .content(content)
                    .images(imageUrls)
                    .tags(tags)
                    .postType(Post.PostType.IMAGE)
                    .likes(0)
                    .shares(0)
                    .comments(0)
                    .views(0)
                    .likedBy(new ArrayList<>())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .userName(user.getProfile().getName())
                    .userGithubUsername(user.getGithubUsername())
                    .userAvatar(user.getProfile().getAvatar())
                    .build();
            return enrichPostWithImageUrls(postRepository.save(post));
        } catch (IOException e) {
            log.error("Failed to upload images for post: {}", e.getMessage());
            throw new RuntimeException("Failed to upload images: " + e.getMessage());
        }
    }

    public Post createArticlePost(String userId, String title, String content, List<String> tags) {
        User user = getUser(userId);
        Post post = Post.builder()
                .userId(userId)
                .articleTitle(title)
                .articleContent(content)
                .tags(tags)
                .postType(Post.PostType.ARTICLE)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .likedBy(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();
        return enrichPostWithImageUrls(postRepository.save(post));
    }

    public Post createCodePost(String userId, String content, String codeSnippet, String language, List<String> tags) {
        User user = getUser(userId);
        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .codeSnippet(codeSnippet)
                .language(language)
                .tags(tags)
                .postType(Post.PostType.CODE)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .likedBy(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();
        return enrichPostWithImageUrls(postRepository.save(post));
    }

    public List<Post> getGlobalFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::enrichPostWithImageUrls)
                .collect(Collectors.toList());
    }

    public List<Post> getUserFeed(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::enrichPostWithImageUrls)
                .collect(Collectors.toList());
    }

    // FIX 6: likePost now toggles based on userId — prevents double-liking and
    // gives the frontend accurate liked/unliked state per user.
    public Post likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<String> likedBy = post.getLikedBy();
        if (likedBy == null) likedBy = new ArrayList<>();

        if (likedBy.contains(userId)) {
            likedBy.remove(userId);
            post.setLikes(Math.max(0, post.getLikes() - 1));
        } else {
            likedBy.add(userId);
            post.setLikes(post.getLikes() + 1);
        }
        post.setLikedBy(likedBy);
        post.setUpdatedAt(LocalDateTime.now());

        return enrichPostWithImageUrls(postRepository.save(post));
    }

    // FIX 6: viewPost accepts userId for future deduplication logic
    public Post viewPost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViews(post.getViews() + 1);
        post.setUpdatedAt(LocalDateTime.now());
        return enrichPostWithImageUrls(postRepository.save(post));
    }

    private User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Post enrichPostWithImageUrls(Post post) {
        if (post.getImages() != null && !post.getImages().isEmpty()) {
            List<String> fullImageUrls = post.getImages().stream()
                    .map(fileName -> baseUrl + "/api/images/" + fileName)
                    .collect(Collectors.toList());
            post.setImages(fullImageUrls);
        }
        return post;
    }
}
